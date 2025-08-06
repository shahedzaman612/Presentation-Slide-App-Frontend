// src/store/store.js

import { create } from "zustand";

export const usePresentationStore = create((set) => ({
  // State variables
  presentation: null,
  slides: [],
  currentSlide: 1,
  user: null,
  selectedElementId: null, // Ensure this state exists
  sendWebSocketMessage: () => {},

  // Actions to update the state
  setPresentationData: (presentation, slides) =>
    set({
      presentation,
      slides,
      selectedElementId: null,
    }),

  setUser: (nickname, role) => set({ user: { nickname, role } }),

  setCurrentSlide: (slideNumber) =>
    set({
      currentSlide: slideNumber,
      selectedElementId: null,
    }),

  // Ensure this action exists
  setSelectedElementId: (id) => set({ selectedElementId: id }),

  // A direct action to update a slide's entire elements array.
  updateSlideElements: (slideId, newElements) => {
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
