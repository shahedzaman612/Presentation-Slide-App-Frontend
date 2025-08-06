// src/components/TextElement.jsx

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { usePresentationStore } from "../store/store";

const TextElement = ({
  element,
  sendWebSocketMessage,
  updateSlideElements,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { slides, currentSlide } = usePresentationStore();

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

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const newX = element.x + dx;
    const newY = element.y + dy;

    // Update position in local state
    const activeSlide = slides.find(
      (slide) => slide.slideNumber === currentSlide
    );
    if (!activeSlide) return;

    const updatedElements = activeSlide.elements.map((el) => {
      if (el.id === element.id) {
        return { ...el, x: newX, y: newY };
      }
      return el;
    });
    updateSlideElements(activeSlide._id, updatedElements);

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Send final position to the server
    const activeSlide = slides.find(
      (slide) => slide.slideNumber === currentSlide
    );
    if (!activeSlide) return;

    const message = {
      type: "UPDATE_ELEMENT",
      presentationId: activeSlide.presentationId,
      payload: {
        slide: {
          ...activeSlide,
          elements: activeSlide.elements,
        },
      },
    };
    sendWebSocketMessage(message);
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
      className="text-element"
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <ReactMarkdown>{element.content}</ReactMarkdown>
    </div>
  );
};

export default TextElement;
