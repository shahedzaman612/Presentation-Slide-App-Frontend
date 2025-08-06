// src/components/SlidesList.jsx

import React from "react";
import { usePresentationStore } from "../store/store";

const SlidesList = ({ slides, presentationId, sendWebSocketMessage }) => {
  const { currentSlide, setCurrentSlide, setPresentationData } =
    usePresentationStore();

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

  const handleDeleteSlide = () => {
    if (!currentSlide) {
      alert("Please select a slide to delete.");
      return;
    }

    const activeSlide = slides.find(
      (slide) => slide.slideNumber === currentSlide
    );
    if (!activeSlide) {
      console.error("Could not find the active slide in the state.");
      return;
    }

    // Filter out the deleted slide from the local state
    const newSlides = slides.filter(
      (slide) => slide.slideNumber !== currentSlide
    );

    // Determine the next slide to display
    let nextCurrentSlide = null;
    if (newSlides.length > 0) {
      const activeSlideIndex = slides.indexOf(activeSlide);
      // Select the previous slide if it exists, otherwise select the first slide
      nextCurrentSlide =
        activeSlideIndex > 0
          ? newSlides[activeSlideIndex - 1].slideNumber
          : newSlides[0].slideNumber;
    }

    // Update local state immediately for a responsive UI
    setPresentationData(null, newSlides); // Assuming null for presentation object
    setCurrentSlide(nextCurrentSlide);

    // Send a message to the server to delete the slide
    const message = {
      type: "DELETE_SLIDE",
      presentationId: presentationId,
      payload: { slideId: activeSlide._id },
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
          <p className="p-3 text-muted text-center">No slides found.</p>
        )}
      </div>
      <div className="d-grid gap-2 mt-3">
        <button onClick={handleAddSlide} className="btn btn-primary">
          Add New Slide
        </button>
        <button
          onClick={handleDeleteSlide}
          className="btn btn-danger"
          disabled={!currentSlide}
        >
          Delete Slide
        </button>
      </div>
    </div>
  );
};

export default SlidesList;
