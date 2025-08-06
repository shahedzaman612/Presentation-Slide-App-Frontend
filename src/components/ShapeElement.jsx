// src/components/ShapeElement.jsx

import React, { useState } from "react";
import { usePresentationStore } from "../store/store";

const ShapeElement = ({
  element,
  sendWebSocketMessage,
  updateSlideElements,
  slide,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { selectedElementId, setSelectedElementId } = usePresentationStore();

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

    // Get the latest state to send to the server
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

  const isSelected = selectedElementId === element.id;

  const getShapeStyle = () => {
    switch (element.style.shapeType) {
      case "circle":
        return {
          borderRadius: "50%",
          backgroundColor: element.style.fillColor,
          border: `${element.style.strokeWidth}px solid ${element.style.strokeColor}`,
        };
      case "triangle":
        return {
          width: 0,
          height: 0,
          borderLeft: `${element.width / 2}px solid transparent`,
          borderRight: `${element.width / 2}px solid transparent`,
          borderBottom: `${element.height}px solid ${element.style.fillColor}`,
          backgroundColor: "transparent", // Required for border-based shapes
        };
      case "rectangle":
      default:
        return {
          backgroundColor: element.style.fillColor,
          border: `${element.style.strokeWidth}px solid ${element.style.strokeColor}`,
        };
    }
  };

  return (
    <div
      className={`p-2 ${isSelected ? "border border-primary" : ""}`}
      style={{
        position: "absolute",
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        ...getShapeStyle(),
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default ShapeElement;
