// src/components/TextElement.jsx

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { usePresentationStore } from "../store/store";

const TextElement = ({ element, sendWebSocketMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const { slides, currentSlide, updateSlideElements } = usePresentationStore();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (element.content !== content) {
      const activeSlide = slides.find(
        (slide) => slide.slideNumber === currentSlide
      );
      if (!activeSlide) return;

      const updatedElements = activeSlide.elements.map((el) => {
        if (el.id === element.id) {
          return { ...el, content: content };
        }
        return el;
      });

      updateSlideElements(activeSlide._id, updatedElements);

      const message = {
        type: "UPDATE_ELEMENT",
        presentationId: activeSlide.presentationId,
        payload: {
          slide: {
            ...activeSlide,
            elements: updatedElements,
          },
        },
      };
      sendWebSocketMessage(message);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <textarea
        style={{
          position: "absolute",
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <ReactMarkdown>{element.content}</ReactMarkdown>
    </div>
  );
};

export default TextElement;
