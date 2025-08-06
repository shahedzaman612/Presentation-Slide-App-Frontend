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
    const newWs = new WebSocket(
      "ws:https://presentation-slide-app-backend.onrender.com"
    );

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
        // The server's ADD_SLIDE now broadcasts the entire slide list.
        setPresentationData(data.payload.presentation, data.payload.slides);
      } else if (data.type === "UPDATE_USERS") {
        setUsers(data.payload.users);
      } else if (data.type === "UPDATE_SLIDES") {
        // NEW: Handle the updated slides list from the server
        setPresentationData(null, data.payload.slides);
      }
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected");
    };

    const fetchPresentation = async () => {
      try {
        const response = await axios.get(
          `https://presentation-slide-app-backend.onrender.com/api/presentations/${presentationId}`
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
    <div className="container-fluid d-flex flex-column vh-100 p-0">
      <Toolbar
        sendWebSocketMessage={sendWebSocketMessage}
        userNickname={userNickname}
        presentationId={presentationId}
        slides={slides}
        onExit={onExit}
      />
      <div className="flex-grow-1 d-flex">
        <SlidesList
          slides={slides}
          presentationId={presentationId}
          sendWebSocketMessage={sendWebSocketMessage}
          users={users}
        />
        <div className="flex-grow-1 p-3 bg-light">
          <SlideCanvas
            slide={activeSlide}
            sendWebSocketMessage={sendWebSocketMessage}
            updateSlideElements={updateSlideElements}
          />
        </div>
        <UserPanel users={users} />
      </div>
    </div>
  );
};

export default Presentation;
