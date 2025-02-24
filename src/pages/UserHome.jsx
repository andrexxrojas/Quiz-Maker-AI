import { useState } from "react";

import "../styles/userHomeStyle.css"

function UserHome() {
    const [code, setCode] = useState("");

    return(
        <div className="user-home-container">
            <div className="additional-container">
                <div className="top-container">
                    <div className="join-container">
                        <div className="join-box">
                            <input 
                                type="text" 
                                placeholder="Enter a join code" 
                                className="join-input" 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button className="join-btn">Join</button>
                        </div>
                    </div>

                    <div className="generate-container">
                        <div className="generate-box">
                            <h3>Make a Quiz</h3>

                            <div className="choice-container">
                                <button>Create Quiz Manually</button>
                                <span>/</span>
                                <button>Generate With AI</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bottom-container">
                    <h3>Your Quizzes</h3>
                </div>
            </div>
        </div>
    )
}

export default UserHome;