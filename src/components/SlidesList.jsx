// src/components/SlidesList.jsx

import React from "react";
import { usePresentationStore } from "../store/store";

const SlidesList = ({ slides, presentationId, sendWebSocketMessage }) => {
  const { currentSlide, setCurrentSlide } = usePresentationStore();

  const handleAddSlide = () => {
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
    <div className="card shadow-sm p-3">
      <h5 className="card-title">Slides</h5>
      <div className="list-group list-group-flush">
        {slides && slides.length > 0 ? (
          slides.map((slide) => (
            <button
              key={slide._id}
              className={`list-group-item list-group-item-action ${
                slide.slideNumber === currentSlide ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(slide.slideNumber)}
            >
              Slide {slide.slideNumber}
            </button>
          ))
        ) : (
          <p className="text-muted text-center py-2">No slides found.</p>
        )}
      </div>
      <button onClick={handleAddSlide} className="btn btn-primary mt-3">
        Add New Slide
      </button>
    </div>
  );
};

export default SlidesList;
