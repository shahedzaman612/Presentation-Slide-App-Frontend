// src/components/SlideCanvas.jsx

import React from "react";
import TextElement from "./TextElement";
import { usePresentationStore } from "../store/store";

const SlideCanvas = ({ sendWebSocketMessage }) => {
  // Get slides and currentSlide directly from the store
  const { slides, currentSlide } = usePresentationStore();

  // Find the active slide based on the currentSlide number
  const activeSlide = slides.find(
    (slide) => slide.slideNumber === currentSlide
  );

  // If there's no active slide, display a message
  if (!activeSlide) {
    return (
      <div className="slide-canvas">
        <p>No slide selected.</p>
      </div>
    );
  }

  return (
    <div className="slide-canvas">
      {activeSlide.elements.map((element) => (
        <div key={element.id} className="element-container">
          {element.type === "text" && (
            <TextElement
              element={element}
              sendWebSocketMessage={sendWebSocketMessage}
            />
          )}
          {/* Add other element types here */}
        </div>
      ))}
    </div>
  );
};

export default SlideCanvas;
