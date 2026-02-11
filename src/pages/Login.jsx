import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../shared/Button'
import { Input } from '../shared/Input'
import { Card } from '../shared/Card'
import './Login.css'

export const Login = () => {
  const [isSignup, setIsSignup] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'student'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, signup } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        // Validation
        if (!formData.name.trim()) {
          throw new Error('Name is required')
        }
        if (!formData.email.trim()) {
          throw new Error('Email is required')
        }
        if (!formData.password.trim()) {
          throw new Error('Password is required')
        }
        
        await signup(
          formData.email,
          formData.name,
          formData.role,
          formData.phone,
          formData.password
        )
      } else {
        // Login validation
        if (!formData.email.trim()) {
          throw new Error('Email is required')
        }
        if (!formData.password.trim()) {
          throw new Error('Password is required')
        }
        
        await login(formData.email, formData.password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError('')
    setFormData({
      ...formData,
      name: '',
      phone: ''
    })
  }

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-content">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">🎓 Test Platform</h1>
          <p className="login-subtitle">Premium Online Testing System</p>
        </div>

        {/* Login Card */}
        <Card className="login-card">
          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`tab ${!isSignup ? 'tab-active' : ''}`}
              onClick={() => {
                setIsSignup(false)
                setError('')
              }}
            >
              Login
            </button>
            <button
              className={`tab ${isSignup ? 'tab-active' : ''}`}
              onClick={() => {
                setIsSignup(true)
                setError('')
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Signup Fields */}
            {isSignup && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  icon="👤"
                  required
                />

                {/* Role Selector */}
                <div className="input-group">
                  <label className="input-label">
                    Role <span className="input-required">*</span>
                  </label>
                  <div className="role-selector">
                    <label className={`role-option ${formData.role === 'student' ? 'role-selected' : ''}`}>
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={formData.role === 'student'}
                        onChange={handleChange}
                      />
                      <div className="role-content">
                        <span className="role-icon">🎓</span>
                        <span className="role-name">Student</span>
                      </div>
                    </label>

                    <label className={`role-option ${formData.role === 'admin' ? 'role-selected' : ''}`}>
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleChange}
                      />
                      <div className="role-content">
                        <span className="role-icon">👨‍🏫</span>
                        <span className="role-name">Admin</span>
                      </div>
                    </label>

                    <label className={`role-option ${formData.role === 'master' ? 'role-selected' : ''}`}>
                      <input
                        type="radio"
                        name="role"
                        value="master"
                        checked={formData.role === 'master'}
                        onChange={handleChange}
                      />
                      <div className="role-content">
                        <span className="role-icon">👑</span>
                        <span className="role-name">Master</span>
                      </div>
                    </label>
                  </div>
                </div>

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  icon="📱"
                />
              </>
            )}

            {/* Common Fields */}
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon="✉️"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon="🔒"
              required
            />

            {/* Error Message */}
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              {isSignup ? 'Create Account' : 'Login'}
            </Button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            {!isSignup ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={toggleMode}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={toggleMode}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </Card>

        {/* Features */}
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <span className="feature-text">Fast & Secure</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span className="feature-text">Real-time Results</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Smart Analytics</span>
          </div>
        </div>
      </div>
    </div>
  )
}