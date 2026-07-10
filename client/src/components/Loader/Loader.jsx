import React from 'react';
import './Loader.css';

// size: 'sm' | 'md' | 'lg'. fullPage centers it in a min-height viewport area,
// useful as a page-level loading state before data arrives.
const Loader = ({ size = 'md', fullPage = false, label }) => {
  return (
    <div className={`loader-wrap ${fullPage ? 'loader-wrap--full' : ''}`}>
      <span className={`loader loader--${size}`} aria-hidden="true" />
      {label && <span className="loader__label">{label}</span>}
    </div>
  );
};

export default Loader;
