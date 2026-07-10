import React from 'react';
import './Badge.css';
import { titleCase } from '../../utils/formatters';

// variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
const Badge = ({ children, variant = 'neutral' }) => {
  const label = typeof children === 'string' ? titleCase(children) : children;
  return <span className={`badge badge--${variant}`}>{label}</span>;
};

export default Badge;
