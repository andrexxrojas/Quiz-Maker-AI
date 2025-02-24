import { useState } from "react";

function QuizAI() {
    const [quizName, setQuizName] = useState("");
    const [formData, setFormData] = useState({
        topic: "",
        subTopic: "",
        grade: "",
        questionType: "Multiple Choice",
        questionStyle: "Direct",
        difficulty: "Easy",
        numQuestions: 5
    })

    const handleSelection = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return(
        <div className="quiz-container ai">
            <div className="additional-container">
                <div className="quiz-container-box">
                    <h3>Generate a Quiz</h3>

                    <div className="quiz-generation-details">
                        <div className="single-div">
                            <label htmlFor="">Quiz Topic</label>
                            <input 
                                type="text" 
                                placeholder="Enter quiz topic"
                                value={formData.topic}
                                onChange={(e) => handleSelection("topic", e.target.value)}
                            />
                        </div>

                        <div className="single-div">
                            <label htmlFor="">Sub-topic</label>
                            <input 
                                type="text" 
                                placeholder="Enter sub-topic"
                                value={formData.subTopic}
                                onChange={(e) => handleSelection("subTopic", e.target.value)}
                            />
                        </div>

                        <div className="single-div">
                            <label htmlFor="">Grade Level</label>
                            <input 
                                type="text" 
                                placeholder="Enter grade level (1 - 12)"
                                value={formData.grade}
                                onChange={(e) => handleSelection("grade", e.target.value)}
                            />
                        </div>

                        {
                            [
                                { label: "Question Type", field: "questionType", options: ["Multiple Choice", "Fill in The Blank", "Mixed"] },
                                { label: "Question Style", field: "questionStyle", options: ["Direct", "Scenario-Based", "Conceptual"] },
                                { label: "Difficulty", field: "difficulty", options: ["Easy", "Medium", "Hard"] },
                                { label: "Number of Questions", field: "numQuestions", options: [5, 10, 15] }
                            ].map(({ label, field, options }) => (
                                <div key={field} className="multiple-div">
                                    <label htmlFor="">{label}</label>
                                    <div className="multiple-options">
                                        {
                                            options.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => handleSelection(field, option)}
                                                    className={`option-button ${formData[field] === option ? "selected" : ""}`}
                                                >
                                                    {option}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <button className="submit-btn">Submit</button>
                </div>
            </div>
        </div>
    )
}

export default QuizAI;