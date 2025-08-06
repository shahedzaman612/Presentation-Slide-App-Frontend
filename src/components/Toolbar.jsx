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
      console.t("Could not find the active slide in the state.");
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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand">
          Editing as: <strong>{userNickname}</strong>
        </span>
        <span className="navbar-text ms-3">ID: {presentationId}</span>

        <div className="d-flex ms-auto">
          <div className="btn-group me-2" role="group">
            <button
              className="btn btn-outline-primary"
              onClick={handleAddTextBlock}
            >
              Add Text Block
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={handleDeleteElement}
              disabled={!selectedElementId}
            >
              Delete Element
            </button>
          </div>
          <div className="btn-group me-2" role="group">
            <button className="btn btn-outline-secondary" disabled>
              Add Shape (TODO)
            </button>
            <button className="btn btn-outline-secondary" disabled>
              Add Image (TODO)
            </button>
          </div>
          <button className="btn btn-outline-dark" onClick={onExit}>
            Exit Presentation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Toolbar;
