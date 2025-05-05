import { useNavigate } from "react-router-dom";
import GeneratedQuestion from "../components/GeneratedQuestion";
import CreateQuizAI from "../pages/CreateQuizAI";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createQuiz, generateQuizAI } from "../services/quizService";

import "../styles/quizStyle.css"

function QuizAI() {
    const [generated, setGenerated] = useState(false);
    const [generatedQuizTitle, setGeneratedQuizTitle] = useState("");
    const [generatedQuiz, setGeneratedQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acceptedQuestions, setAcceptedQuestions] = useState([]);
    const [formData, setFormData] = useState(null);

    const { isAuthenticated, loading: authLoading, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authLoading) return; 
        if (!isAuthenticated) {
            navigate("/"); 
            return;
        }

        setLoading(false)
        navigate("/quiz-generation");
    }, [loading, isAuthenticated, navigate]);

    useEffect(() => {
        console.log("Generated state changed:", generated);
        console.log("Generated Quiz Length:", generatedQuiz.length);
    }, [generated, generatedQuiz]);    

    const handleQuestionUpdate = (updatedQuestion) => {
        setGeneratedQuiz(prevQuiz => {
            const updatedQuiz = [...prevQuiz];
            updatedQuiz[currentQuestionIndex] = updatedQuestion;
            return updatedQuiz;
        });
    };

    const handleAcceptQuestion = async () => {
        if (generatedQuiz.length > 0) {
            const currentQuestion = generatedQuiz[currentQuestionIndex];
    
            const hasCorrectAnswer = currentQuestion.options.some(opt => opt.isCorrect);
    
            if (!hasCorrectAnswer) {
                alert("The generated question must have one correct answer before accepting!");
                return;
            }
    
            setAcceptedQuestions(prev => {
                const updatedAcceptedQuestions = [...prev, currentQuestion];
    
                // If the number of accepted questions matches the required number, save the quiz
                if (updatedAcceptedQuestions.length === formData.numQuestions) {
                    handleSaveQuiz(updatedAcceptedQuestions);
                }
    
                return updatedAcceptedQuestions;
            });
    
            if (currentQuestionIndex < generatedQuiz.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setLoading(true);
    
            const existingQuestions = [
                ...generatedQuiz.map(q => q.text),
                ...acceptedQuestions.map(q => q.text)
            ];
    
            const prompt = `Generate a new ${formData.difficulty.toLowerCase()}-level ${formData.questionType.toLowerCase()} question  
            for the topic "${formData.topic}" and subtopic "${formData.subTopic}".  
            The question should follow a "${formData.questionStyle.toLowerCase()}" style and be suitable for a grade ${formData.grade} student.  
            Provide four answer choices, with one correct answer clearly indicated.
    
            ### Important: 
            - Do NOT generate a question that is similar to these existing ones:  
              "${existingQuestions.join("; ")}".  
            - Ensure the question is **unique** and **different** from these.`;
    
            try {
                const newQuestionData = await generateQuizAI(prompt);
    
                if (newQuestionData?.questions?.length > 0) {
                    const newQuestion = newQuestionData.questions[0];
    
                    const formattedQuestion = {
                        text: newQuestion.question,
                        options: newQuestion.choices.map(choice => ({
                            id: Math.random().toString(36).substr(2, 9),
                            text: choice,
                            isCorrect: choice === newQuestion.correctAnswer
                        }))
                    };
    
                    setGeneratedQuiz(prevQuiz => {
                        const updatedQuiz = [...prevQuiz, formattedQuestion];
    
                        // Then, ensure we update the current index correctly
                        setCurrentQuestionIndex(updatedQuiz.length - 1); // Move to the newly added question
                        return updatedQuiz;
                    });
                }
            } catch (err) {
                console.error("Error generating new question:", err);
            }
            }
        }
    };
    

    const handleDeclineQuestion = async () => {
        if (currentQuestionIndex < generatedQuiz.length - 1) {
            // Move to the next question if available
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Generate a new unique question
            setLoading(true);
    
            const existingQuestions = [
                ...generatedQuiz.map(q => q.text),
                ...acceptedQuestions.map(q => q.text)
            ];
    
            const prompt = `Generate a new ${formData.difficulty.toLowerCase()}-level ${formData.questionType.toLowerCase()} question  
            for the topic "${formData.topic}" and subtopic "${formData.subTopic}".  
            The question should follow a "${formData.questionStyle.toLowerCase()}" style and be suitable for a grade ${formData.grade} student.  
            Provide four answer choices, with one correct answer clearly indicated.
    
            ### Important: 
            - Do NOT generate a question that is similar to these existing ones:  
              "${existingQuestions.join("; ")}".  
            - Ensure the question is **unique** and **different** from these.`;
    
            try {
                const newQuestionData = await generateQuizAI(prompt);
    
                if (newQuestionData?.questions?.length > 0) {
                    const newQuestion = newQuestionData.questions[0];
    
                    const formattedQuestion = {
                        text: newQuestion.question,
                        options: newQuestion.choices.map(choice => ({
                            id: Math.random().toString(36).substr(2, 9),
                            text: choice,
                            isCorrect: choice === newQuestion.correctAnswer
                        }))
                    };
    
                    setGeneratedQuiz(prevQuiz => {
                        const updatedQuiz = [...prevQuiz, formattedQuestion];
    
                        // Then, ensure we update the current index correctly
                        setCurrentQuestionIndex(updatedQuiz.length - 1); // Move to the newly added question
                        return updatedQuiz;
                    });
                }
            } catch (err) {
                console.error("Error generating new question:", err);
            }
    
            setLoading(false);
        }
    };
    

    const handleNewQuizGeneration = (quiz) => {
        console.log("Received quiz data:", quiz);
    
        if (!quiz?.questions?.length) {
            console.error("Quiz format invalid or empty:", quiz);
            return;
        }

        setGeneratedQuizTitle(quiz.quizTitle);
    
        const formattedQuiz = quiz.questions.map(q => ({
            text: q.question,
            options: q.choices.map(choice => ({
                id: Math.random().toString(36).substr(2, 9),
                text: choice,
                isCorrect: choice === q.correctAnswer
            }))
        }));
    
        setGeneratedQuiz(formattedQuiz);
        setGenerated(true);
        setCurrentQuestionIndex(0);
        setAcceptedQuestions([]);
    };

    const handleSaveQuiz = async () => {
        try {
            if (!generatedQuiz || !generatedQuizTitle || acceptedQuestions.length === 0) {
                console.error("Missing quiz title or no accepted questions");
                setError("Cannot save an empty quiz");
                return;
            }
    
            const formattedQuestions = acceptedQuestions.map(q => ({
                text: q.text,
                options: q.options.map(opt => ({
                    text: opt.text,
                    isCorrect: opt.isCorrect
                }))
            }));
    
            await createQuiz({ title: generatedQuizTitle, gradeLevel: formData.grade, questions: formattedQuestions }, token);
            
            setGenerated(false);
            setGeneratedQuiz({ quizTitle: "", questions: [] });
            setAcceptedQuestions([]);
            navigate('/userHome');
        } catch (err) {
            setError("Failed to save quiz");
            console.error("Error creating quiz:", err);
        }
    };

    return (
        <div className="quiz-generation-container quiz-container">
            <div className="additional-container">
            {!generated && (
                <CreateQuizAI 
                setGenerated={setGenerated} 
                setGeneratedQuiz={handleNewQuizGeneration}
                setPassData={setFormData}
                />
            )}

            {generated && generatedQuiz.length > 0 && (
                <div className="quiz-container acceptance">
                    <div className="additional-container">
                        <div className="left">
                            <div className="top">
                                <h4>Accepted Questions</h4>
                                <div className="accepted-list">
                                    {acceptedQuestions.map((question, index) => (
                                        <div key={index} className="accepted-box">
                                            <p>{question.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="button-options">
                                <button onClick={() => {
                                    setGenerated(false);
                                    setGeneratedQuiz([]); // Reset properly
                                }}>
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveQuiz}
                                    disabled={acceptedQuestions.length === 0}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {generatedQuiz.length > 0 && (
                            <div className="right">
                                <GeneratedQuestion
                                    question={generatedQuiz[currentQuestionIndex]}
                                    onUpdate={handleQuestionUpdate}
                                />
                                <div className="button-options">
                                    <button onClick={handleDeclineQuestion}>Decline</button>
                                    <button onClick={handleAcceptQuestion}>Accept</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            </div>
        </div>
    );
}

export default QuizAI;