// src/components/SlideCanvas.jsx

import React from "react";
import TextElement from "./TextElement";
import { usePresentationStore } from "../store/store";

const SlideCanvas = ({ slide, sendWebSocketMessage, updateSlideElements }) => {
  // Add updateSlideElements here
  if (!slide) {
    return (
      <div className="slide-canvas">
        <p>No slide selected.</p>
      </div>
    );
  }

  return (
    <div className="slide-canvas">
      {slide.elements.map((element) => (
        <div key={element.id} className="element-container">
          {element.type === "text" && (
            <TextElement
              element={element}
              sendWebSocketMessage={sendWebSocketMessage}
              // Pass updateSlideElements here
              updateSlideElements={updateSlideElements}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SlideCanvas;
