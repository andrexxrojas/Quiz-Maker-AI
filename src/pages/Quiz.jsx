import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getQuiz, joinQuiz } from "../services/quizService";

import "../styles/takeQuizStyle.css";

function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const fetchQuiz = async () => {
      let data = "";

      try {
        if (window.location.pathname.includes("/quiz/join/")) {
          data = await joinQuiz(id);
        } else {
          data = await getQuiz(id);
        }

        const correctList = data.questions.reduce((acc, question) => {
          const correctOption = question.options.find(
            (option) => option.isCorrect
          );
          if (correctOption) {
            acc[question._id] = correctOption.text;
          }
          return acc;
        }, {});

        setCorrectAnswers(correctList);
        setQuiz(data);
      } catch (err) {
        setError(err.message || "Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
    setLoading(false);
    navigate(`/quiz/${id}`);
  }, [loading, authLoading, isAuthenticated, navigate, id]);

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleNext = () => {
    if (selectedOption === null) return alert("Please select an answer!");

    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [currentQuestion._id]: selectedOption,
      };

      if (currentQuestionIndex === quiz.questions.length - 1) {
        const finalScore = calculateScore(updatedAnswers);
        setFinalScore(finalScore);

        setQuizComplete(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }

      return updatedAnswers;
    });

    setSelectedOption(null);
  };

  const calculateScore = (finalAnswers) => {
    let score = 0;

    quiz.questions.forEach((question) => {
      const selectedOption = finalAnswers[question._id];
      const correctOption = correctAnswers[question._id];

      if (selectedOption === correctOption) {
        score += 1;
      }
    });

    return score;
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setFinalScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="quiz-container">
      <div className="additional-container">
        {!quizComplete ? (
          <>
            <h2>{quiz.title}</h2>
            <div className="question-container">
              <h3>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h3>
              <p>{currentQuestion.text}</p>
              <ul>
                {currentQuestion.options.map((option, index) => (
                  <li
                    key={index}
                    className={`quiz-option ${
                      selectedOption === option.text ? "selected" : ""
                    }`}
                    onClick={() => setSelectedOption(option.text)}
                  >
                    {option.text}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handleNext} className="submit-btn">
              {currentQuestionIndex < quiz.questions.length - 1
                ? "Next"
                : "Finish"}
            </button>
          </>
        ) : (
          <>
            <div className="try-again-container">
              <h2>
                You got a score of {finalScore} / {quiz.questions.length}
              </h2>
              <div className="button-container">
                <button
                  className="try-again btn"
                  onClick={() => {
                    navigate("/userHome");
                  }}
                >
                  Go Home
                </button>
                <button className="try-again btn" onClick={handleTryAgain}>
                  Try Again
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;
