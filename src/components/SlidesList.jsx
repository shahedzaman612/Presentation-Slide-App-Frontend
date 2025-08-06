// src/components/SlidesList.jsx

import React from 'react';
import { usePresentationStore } from '../store/store';

const SlidesList = ({ slides }) => {
  const { currentSlide, setCurrentSlide } = usePresentationStore();

  return (
    <div className="slides-list">
      <h3>Slides</h3>
      {slides && slides.length > 0 ? (
        slides.map((slide) => (
          <div
            key={slide._id}
            className={`slide-item ${slide.slideNumber === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(slide.slideNumber)}
          >
            Slide {slide.slideNumber}
          </div>
        ))
      ) : (
        <p>No slides found.</p>
      )}
      <h3>Users</h3>
      {/* The `users` list is a stretch goal, so we'll show a placeholder for now. */}
      <ul>
        <li>(creator)</li>
      </ul>
    </div>
  );
};

export default SlidesList;