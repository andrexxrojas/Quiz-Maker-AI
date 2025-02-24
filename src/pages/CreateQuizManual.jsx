import { useState } from "react";
import "../styles/quizStyle.css";
import QuizQuestion from "../components/QuizQuestion";

function QuizManual() {
    const [quizName, setQuizName] = useState("");

    return(
        <div className="quiz-container manual">
            <div className="additional-container">
                <div className="quiz-container-box">
                    <h3>Create a new quiz</h3>
                    <input 
                        id="quizName"
                        type="text" 
                        value={quizName} 
                        onChange={(e) => {setQuizName(e.target.value)}}
                        placeholder="Enter a quiz name"
                    />
                    <button>
                        <i class="fa-solid fa-square-plus"></i>
                        Create Question
                    </button>
                </div>

                <div className="quiz-list">
                    <QuizQuestion/>
                    <QuizQuestion/>
                </div>
            </div>
        </div>
    )
}

export default QuizManual;