// src/components/TextElement.jsx

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { usePresentationStore } from "../store/store";

const TextElement = ({ element, sendWebSocketMessage, slide }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { selectedElementId, setSelectedElementId, updateSlideElements } =
    usePresentationStore();

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (element.content !== content) {
      const updatedElements = slide.elements.map((el) => {
        if (el.id === element.id) {
          return { ...el, content: content };
        }
        return el;
      });

      updateSlideElements(slide._id, updatedElements);

      const message = {
        type: "UPDATE_ELEMENT",
        presentationId: slide.presentationId,
        payload: {
          slide: {
            ...slide,
            elements: updatedElements,
          },
        },
      };
      sendWebSocketMessage(message);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setSelectedElementId(element.id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const newX = element.x + dx;
    const newY = element.y + dy;

    const updatedElements = slide.elements.map((el) => {
      if (el.id === element.id) {
        return { ...el, x: newX, y: newY };
      }
      return el;
    });

    updateSlideElements(slide._id, updatedElements);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const latestSlide = usePresentationStore
      .getState()
      .slides.find((s) => s._id === slide._id);
    if (!latestSlide) return;

    const message = {
      type: "UPDATE_ELEMENT",
      presentationId: latestSlide.presentationId,
      payload: {
        slide: {
          ...latestSlide,
          elements: latestSlide.elements,
        },
      },
    };
    sendWebSocketMessage(message);
  };

  if (isEditing) {
    return (
      <textarea
        className="form-control" // Bootstrap class for form inputs
        style={{
          position: "absolute",
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          resize: "none", // Prevent resizing to maintain layout
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    );
  }

  const isSelected = selectedElementId === element.id;

  return (
    <div
      className={`p-2 bg-light ${isSelected ? "border border-primary" : ""}`} // Bootstrap classes for styling
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
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
