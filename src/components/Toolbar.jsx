// src/components/Toolbar.jsx

import React from "react";
import { usePresentationStore } from "../store/store";

const Toolbar = ({
  sendWebSocketMessage,
  userNickname,
  presentationId,
  onExit,
}) => {
  const {
    slides,
    currentSlide,
    updateSlideElements,
    selectedElementId,
    setSelectedElementId,
  } = usePresentationStore();

  const handleAddTextBlock = () => {
    // Check if a slide is currently selected
    if (!currentSlide) {
      alert("No slide is currently selected. Please select or create a slide.");
      return;
    }

    const activeSlide = slides.find(
      (slide) => slide.slideNumber === currentSlide
    );
    if (!activeSlide) {
      console.error("Could not find the active slide in the state.");
      return;
    }

    // Create the new text element
    const newElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: 100,
      y: 100,
      width: 250,
      height: 100,
      content: "New Text Block",
      style: {
        fontSize: 16,
        color: "#333333",
      },
    };

    // Create a new array with the added element
    const updatedElements = [...activeSlide.elements, newElement];

    console.log("Adding element to local state:", newElement);
    // Update local state immediately for a responsive UI
    updateSlideElements(activeSlide._id, updatedElements);

    // Send the entire updated slide back to the server via WebSocket
    const message = {
      type: "ADD_ELEMENT",
      presentationId: activeSlide.presentationId,
      payload: {
        slide: {
          ...activeSlide,
          elements: updatedElements,
        },
      },
    };
    console.log("Preparing to send WebSocket message:", message);
    sendWebSocketMessage(message);
  };

  // New handler for deleting an element
  const handleDeleteElement = () => {
    if (!selectedElementId) {
      alert("Please select an element to delete.");
      return;
    }

    const activeSlide = slides.find(
      (slide) => slide.slideNumber === currentSlide
    );
    if (!activeSlide) {
      console.error("Could not find the active slide in the state.");
      return;
    }

    // Filter out the selected element
    const updatedElements = activeSlide.elements.filter(
      (element) => element.id !== selectedElementId
    );

    // Update local state and deselect the element
    updateSlideElements(activeSlide._id, updatedElements);
    setSelectedElementId(null);

    // Send the updated slide to the server via WebSocket
    const message = {
      type: "DELETE_ELEMENT",
      presentationId: activeSlide.presentationId,
      payload: {
        slide: {
          ...activeSlide,
          elements: updatedElements,
        },
      },
    };
    sendWebSocketMessage(message);
  };

  return (
    <div className="top-bar">
      <div className="user-info">
        <span>
          Editing as: <strong>{userNickname}</strong>
        </span>
        <br />
        <span className="presentation-id">ID: {presentationId}</span>
      </div>
      <div className="toolbar-buttons">
        <button onClick={handleAddTextBlock}>Add Text Block</button>
        <button onClick={handleDeleteElement} disabled={!selectedElementId}>
          Delete Element
        </button>
        <button disabled>Add Shape (TODO)</button>
        <button disabled>Add Image (TODO)</button>
      </div>
      <button className="exit-button" onClick={onExit}>
        Exit Presentation
      </button>
    </div>
  );
};

export default Toolbar;
