function QuizQuestion() {
    return(
        <div className="quiz-question-container">
            <input className="question-input" type="text" placeholder="Type question here"/>

            <div className="option-container">

                <div className="option">
                    <input type="text" placeholder="Type answer here"/>
                    <div className="option-choices">
                        <button><i class="fa-solid fa-trash-can"></i></button>
                        <button><i class="fa-solid fa-check"></i></button>
                    </div>
                </div>

                <div className="option">
                    <input type="text" placeholder="Type answer here"/>
                    <div className="option-choices">
                        <button><i class="fa-solid fa-trash-can"></i></button>
                        <button><i class="fa-solid fa-check"></i></button>
                    </div>
                </div>

                <div className="option">
                    <input type="text" placeholder="Type answer here"/>
                    <div className="option-choices">
                        <button><i class="fa-solid fa-trash-can"></i></button>
                        <button><i class="fa-solid fa-check"></i></button>
                    </div>
                </div>

                <div className="option">
                    <input type="text" placeholder="Type answer here"/>
                    <div className="option-choices">
                        <button><i class="fa-solid fa-trash-can"></i></button>
                        <button><i class="fa-solid fa-check"></i></button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default QuizQuestion;