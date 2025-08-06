// src/App.jsx

import { useState } from "react";
import axios from "axios";
import Presentation from "./components/Presentation";
import "./index.css";

function App() {
  const [nickname, setNickname] = useState("");
  const [presentationId, setPresentationId] = useState("");
  const [currentView, setCurrentView] = useState("welcome");

  const handleCreatePresentation = async () => {
    if (!nickname) {
      alert("Please enter a nickname.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/presentations",
        {
          name: `${nickname}'s Presentation`,
          creatorId: nickname,
        }
      );

      const newPresentationId = response.data.presentationId;
      setPresentationId(newPresentationId);
      setCurrentView("presentation");
    } catch (error) {
      console.error("Error creating presentation:", error);
      alert("Failed to create presentation.");
    }
  };

  const handleJoinPresentation = () => {
    if (!nickname || !presentationId) {
      alert("Please enter a nickname and presentation ID.");
      return;
    }
    setCurrentView("presentation");
  };

  if (currentView === "welcome") {
    return (
      <div className="welcome-container">
        <h1>Collaborative Presentations</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter presentation ID to join"
            value={presentationId}
            onChange={(e) => setPresentationId(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button onClick={handleCreatePresentation}>
            Create New Presentation
          </button>
          <button onClick={handleJoinPresentation}>
            Join Existing Presentation
          </button>
        </div>
      </div>
    );
  }

  return (
    <Presentation presentationId={presentationId} userNickname={nickname} />
  );
}

export default App;
