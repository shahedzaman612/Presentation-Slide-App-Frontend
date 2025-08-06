// src/components/SlideCanvas.jsx

import React from "react";
import TextElement from "./TextElement";
import { usePresentationStore } from "../store/store";

const SlideCanvas = ({ slide, sendWebSocketMessage, updateSlideElements }) => {
  const { setSelectedElementId } = usePresentationStore();

  if (!slide) {
    return (
      <div className="slide-canvas">
        <p>No slide selected.</p>
      </div>
    );
  }

  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  return (
    <div className="slide-canvas" onClick={handleCanvasClick}>
      {slide.elements.map((element) => (
        <div key={element.id} className="element-container">
          {element.type === "text" && (
            <TextElement
              element={element}
              sendWebSocketMessage={sendWebSocketMessage}
              updateSlideElements={updateSlideElements}
              slide={slide} // Pass the slide prop here
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SlideCanvas;
