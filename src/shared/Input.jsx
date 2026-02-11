import React from 'react'
import './Input.css'

export const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false,
  disabled = false,
  name,
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          name={name}
          className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  )
}