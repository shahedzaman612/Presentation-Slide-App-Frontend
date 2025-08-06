// src/components/SlideCanvas.jsx

import React from "react";
import TextElement from "./TextElement";
import { usePresentationStore } from "../store/store";

const SlideCanvas = ({ slide, sendWebSocketMessage, updateSlideElements }) => {
  const { setSelectedElementId } = usePresentationStore();

  if (!slide) {
    return (
      <div className="flex-grow-1 bg-white border shadow-sm p-4">
        <p className="text-center text-muted">No slide selected.</p>
      </div>
    );
  }

  const handleCanvasClick = () => {
    setSelectedElementId(null);
  };

  return (
    <div
      className="bg-white border shadow-sm position-relative h-100 w-100"
      onClick={handleCanvasClick}
    >
      {slide.elements.map((element) => (
        // No custom classes needed here, as the element's position is handled by inline styles
        <div key={element.id}>
          {element.type === "text" && (
            <TextElement
              element={element}
              sendWebSocketMessage={sendWebSocketMessage}
              updateSlideElements={updateSlideElements}
              slide={slide}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SlideCanvas;
