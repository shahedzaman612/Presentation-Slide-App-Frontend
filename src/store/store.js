// src/store/store.js

import { create } from "zustand";

export const usePresentationStore = create((set) => ({
  // State variables
  presentation: null,
  slides: [],
  currentSlide: 1,
  user: null,
  sendWebSocketMessage: () => {}, // Placeholder for the WebSocket send function

  // Actions to update the state
  setPresentationData: (presentation, slides) =>
    set({
      presentation,
      slides,
    }),

  setUser: (nickname, role) => set({ user: { nickname, role } }),

  setCurrentSlide: (slideNumber) => set({ currentSlide: slideNumber }),

  // --- Real-Time Actions ---

  addSlide: (newSlide) =>
    set((state) => ({
      slides: [...state.slides, newSlide].sort(
        (a, b) => a.slideNumber - b.slideNumber
      ),
    })),

  removeSlide: (slideId) =>
    set((state) => ({
      slides: state.slides.filter((slide) => slide._id !== slideId),
    })),

  // A direct action to update a slide's entire elements array.
  updateSlideElements: (slideId, newElements) => {
    console.log(
      `Zustand: Updating slide ${slideId} with new elements.`,
      newElements
    );
    set((state) => ({
      slides: state.slides.map((slide) =>
        slide._id === slideId ? { ...slide, elements: newElements } : slide
      ),
    }));
  },

  updateElement: (slideId, elementId, newProps) =>
    set((state) => {
      const slides = state.slides.map((slide) => {
        if (slide._id === slideId) {
          const elements = slide.elements.map((element) => {
            if (element.id === elementId) {
              return { ...element, ...newProps };
            }
            return element;
          });
          return { ...slide, elements };
        }
        return slide;
      });
      return { slides };
    }),

  addElement: (slideId, newElement) =>
    set((state) => {
      const slides = state.slides.map((slide) => {
        if (slide._id === slideId) {
          return { ...slide, elements: [...slide.elements, newElement] };
        }
        return slide;
      });
      return { slides };
    }),
}));
