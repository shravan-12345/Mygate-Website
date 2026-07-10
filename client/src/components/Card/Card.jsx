import React from 'react';
import './Card.css';

// accent: optional color-coded top border for dashboard stat cards
// ('primary' | 'success' | 'warning' | 'danger' | 'info' | none)
const Card = ({ children, title, actions, accent, padded = true, className = '' }) => {
  return (
    <div className={`card ${accent ? `card--accent-${accent}` : ''} ${className}`}>
      {(title || actions) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className={padded ? 'card__body' : ''}>{children}</div>
    </div>
  );
};

export default Card;
