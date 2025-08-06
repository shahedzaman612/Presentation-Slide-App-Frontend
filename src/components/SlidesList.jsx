// src/components/SlidesList.jsx

import React from "react";
import { usePresentationStore } from "../store/store";

const SlidesList = ({ slides, presentationId, sendWebSocketMessage }) => {
  const { currentSlide, setCurrentSlide } = usePresentationStore();

  const handleAddSlide = () => {
    // Determine the number for the new slide. If no slides exist, start with 1.
    const newSlideNumber =
      slides.length > 0 ? Math.max(...slides.map((s) => s.slideNumber)) + 1 : 1;

    const newSlide = {
      presentationId: presentationId,
      slideNumber: newSlideNumber,
      elements: [],
    };

    const message = {
      type: "ADD_SLIDE",
      presentationId: presentationId,
      payload: { slide: newSlide },
    };
    sendWebSocketMessage(message);
  };

  return (
    <div className="slides-list">
      <h3>Slides</h3>
      {slides && slides.length > 0 ? (
        slides.map((slide) => (
          <div
            key={slide._id}
            className={`slide-item ${
              slide.slideNumber === currentSlide ? "active" : ""
            }`}
            onClick={() => setCurrentSlide(slide.slideNumber)}
          >
            Slide {slide.slideNumber}
          </div>
        ))
      ) : (
        <p>No slides found.</p>
      )}
      <button onClick={handleAddSlide} className="add-slide-btn">
        Add New Slide
      </button>

      <h3>Users</h3>
      {/* The `users` list is a stretch goal, so we'll show a placeholder for now. */}
      <ul>
        <li>(creator)</li>
      </ul>
    </div>
  );
};

export default SlidesList;
