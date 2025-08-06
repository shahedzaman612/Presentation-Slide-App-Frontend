// src/components/ShapeElement.jsx

import React from 'react';

const ShapeElement = ({ element }) => {
  const { x, y, width, height, style } = element;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: style.fillColor,
        border: `${style.strokeWidth}px solid ${style.strokeColor}`
      }}
    />
  );
};

export default ShapeElement;