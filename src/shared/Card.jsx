import React from 'react'
import './Card.css'

export const Card = ({ 
  children, 
  title, 
  subtitle,
  headerAction,
  variant = 'default',
  hover = false,
  className = ''
}) => {
  return (
    <div className={`card card-${variant} ${hover ? 'card-hover' : ''} ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="card-header">
          <div className="card-header-text">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card-header-action">{headerAction}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}