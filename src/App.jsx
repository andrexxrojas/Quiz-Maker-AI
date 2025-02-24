// Other
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Styling
import "./styles/appStyle.css";

// Components
import Nav from "./components/Nav";
import LoginRegisterModal from "./components/LoginRegisterModal";

// Pages
import Home from "./pages/Home";
import UserHome from "./pages/UserHome";
import CreateQuizManual from "./pages/CreateQuizManual";
import CreateQuizAI from "./pages/CreateQuizAI";
import QuizAI from "./pages/QuizAI";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleOpenModal = (mode) => {
    setAuthMode(mode);
    setModalOpen(true);
  }

  return(
    <div className="app-container">
      <Router>
        <Nav onOpenModal={ handleOpenModal }/>
        <Routes>
          <Route path="/" element={<Home onOpenModal={ handleOpenModal }/>} />
          <Route path="/userHome" element={<UserHome/>} />
          <Route path="/quizManual" element={<CreateQuizManual/>}/>
          <Route path="/quiznew" element={<CreateQuizAI/>}/>
        </Routes>
        <LoginRegisterModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          mode={authMode}
          onSwitchMode={handleOpenModal}
        />
      </Router>
    </div>
  )
}

export default App;