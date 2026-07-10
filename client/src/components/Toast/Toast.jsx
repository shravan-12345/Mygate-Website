import React from 'react';
import './Toast.css';

const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '!' };

const Toast = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`toast toast--${type}`}>
      <span className="toast__icon">{ICONS[type] || ICONS.info}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss notification">
        ✕
      </button>
    </div>
  );
};

export default Toast;
