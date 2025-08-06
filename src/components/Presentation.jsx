// src/components/Presentation.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePresentationStore } from "../store/store";
import SlidesList from "./SlidesList";
import SlideCanvas from "./SlideCanvas";
import Toolbar from "./Toolbar";
import UserPanel from "./UserPanel";

const Presentation = ({ presentationId, userNickname, onExit }) => {
  const {
    slides,
    currentSlide,
    setPresentationData,
    updateSlideElements,
    setCurrentSlide,
  } = usePresentationStore();
  const sendWebSocketMessage =
    usePresentationStore.getState().sendWebSocketMessage;

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // ... (WebSocket and fetch logic remains the same)
    const newWs = new WebSocket("ws://localhost:3000");
    newWs.onopen = () => {
      console.log("WebSocket connected");
      const message = {
        type: "JOIN_PRESENTATION",
        presentationId,
        payload: { userNickname },
      };
      newWs.send(JSON.stringify(message));
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "UPDATE_SLIDE") {
        updateSlideElements(
          data.payload.slide._id,
          data.payload.slide.elements
        );
      } else if (data.type === "ADD_SLIDE") {
        setPresentationData(data.payload.presentation, data.payload.slides);
      } else if (data.type === "UPDATE_USERS") {
        setUsers(data.payload.users);
      }
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected");
    };

    const fetchPresentation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/presentations/${presentationId}`
        );

        setPresentationData(response.data.presentation, response.data.slides);

        if (response.data.slides.length > 0) {
          setCurrentSlide(response.data.slides[0].slideNumber);
        }
      } catch (error) {
        console.error("Error fetching presentation:", error);
      }
    };
    fetchPresentation();

    usePresentationStore.setState({
      sendWebSocketMessage: (message) => {
        if (newWs.readyState === WebSocket.OPEN) {
          newWs.send(JSON.stringify(message));
        }
      },
    });

    return () => {
      newWs.close();
    };
  }, [
    presentationId,
    userNickname,
    setPresentationData,
    updateSlideElements,
    setCurrentSlide,
    setUsers,
  ]);

  const activeSlide = slides.find(
    (slide) => slide.slideNumber === currentSlide
  );

  return (
    <div className="presentation-container">
      <Toolbar
        sendWebSocketMessage={sendWebSocketMessage}
        userNickname={userNickname}
        presentationId={presentationId}
        slides={slides}
        onExit={onExit} // Pass the onExit prop to the Toolbar
      />
      <div className="main-content">
        <SlidesList
          slides={slides}
          presentationId={presentationId}
          sendWebSocketMessage={sendWebSocketMessage}
          users={users}
        />
        <SlideCanvas
          slide={activeSlide}
          sendWebSocketMessage={sendWebSocketMessage}
          updateSlideElements={updateSlideElements}
        />
      </div>
      <UserPanel users={users} />
    </div>
  );
};

export default Presentation;
