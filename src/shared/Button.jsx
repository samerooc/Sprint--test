import React from 'react'
import './Button.css'

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  icon,
  loading = false
}) => {
  const className = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${disabled || loading ? 'btn-disabled' : ''}`
  
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-spinner">⏳</span>
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  )
}