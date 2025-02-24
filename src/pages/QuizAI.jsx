import QuizQuestion from "../components/QuizQuestion";

function QuizAI() {
    return(
        <div className="quiz-container acceptance">
            <div className="additional-container">
                <div className="left">
                    <div className="top">
                        <h4>Accepted Questions</h4>

                        <div className="accepted-list">
                            <div className="accepted-box">
                                <p>How many legs on a cheetah...</p>
                            </div>
                            <div className="accepted-box">
                                <p>How many legs on a cheetah...</p>
                            </div>
                        </div>
                    </div>

                    <div className="button-options">
                        <button>Cancel</button>
                        <button>Save</button>
                    </div>
                </div>
                <div className="right">
                    <QuizQuestion/>
                    <div className="button-options">
                        <button>Decline</button>
                        <button>Accept</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizAI;