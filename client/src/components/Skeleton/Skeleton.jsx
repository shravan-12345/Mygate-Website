import React from 'react';
import './Skeleton.css';

// A generic shimmering placeholder block. Compose several to mimic the shape
// of the content that's loading (e.g. a card: one wide line + two narrow lines).
const Skeleton = ({ width = '100%', height = '14px', radius = 'var(--radius-sm)', className = '' }) => {
  return <span className={`skeleton ${className}`} style={{ width, height, borderRadius: radius }} />;
};

export default Skeleton;
