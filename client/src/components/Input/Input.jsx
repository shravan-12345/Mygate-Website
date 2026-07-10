import React, { forwardRef } from 'react';
import './Input.css';

// Forwarding the ref lets pages use react-hook-form-style patterns later
// (e.g. focusing the first invalid field) without changing this component.
const Input = forwardRef(
  ({ label, error, helperText, icon, type = 'text', id, required = false, className = '', ...rest }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`field ${className}`}>
        {label && (
          <label htmlFor={inputId} className="field__label">
            {label}
            {required && <span className="field__required">*</span>}
          </label>
        )}
        <div className={`field__control ${error ? 'field__control--error' : ''}`}>
          {icon && <span className="field__icon">{icon}</span>}
          <input ref={ref} id={inputId} type={type} className="field__input" {...rest} />
        </div>
        {error && <span className="field__error">{error}</span>}
        {!error && helperText && <span className="field__helper">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
