import React from 'react';
import './Button.css';

// variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
// size: 'sm' | 'md' | 'lg'
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
