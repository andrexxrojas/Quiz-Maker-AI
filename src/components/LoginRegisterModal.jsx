// Other
import { useState } from "react";

// Styling
import "../styles/appStyle.css";

function LoginRegisterModal({ isOpen, onClose, mode, onSwitchMode }) {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>x</button>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        
        <form>
          {mode === "register" && (
            <div>
              <label>Username</label>
              <input type="text" placeholder="Enter username" required />
            </div>
          )}

          <div>
            <label>Email</label>
            <input type="email" placeholder="Enter email" required />
          </div>

          <div>
            <label>Password</label>
            <input type="password" placeholder="Enter password" required />
          </div>

          <button id="submit-btn" type="submit">{mode === "login" ? "Login" : "Register"}</button>
        </form>

        <p className="account-qa">
          {mode === "login" ? (
            <>
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode("register"); } }>Register</a>
            </>
          ) : (
            <>
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode("login"); } }>Login</a>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

export default LoginRegisterModal;
