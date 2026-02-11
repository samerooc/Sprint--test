import React, { createContext, useState, useContext, useEffect } from 'react'
import { getUserByEmail, createUser } from '../Utility/database'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('currentUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Get user from database
      const user = await getUserByEmail(email)
      
      if (!user) {
        throw new Error('User not found. Please sign up first.')
      }
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user))
      setCurrentUser(user)
      
      console.log('✅ Login successful:', user.role)
      return user
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  }

  const signup = async (email, name, role, phone, password) => {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        throw new Error('User already exists. Please login.')
      }
      
      // Create new user in database
      const newUser = await createUser(email, name, role, phone)
      
      // Auto-login after signup
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      setCurrentUser(newUser)
      
      console.log('✅ Signup successful:', newUser.role)
      return newUser
    } catch (error) {
      console.error('❌ Signup failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    console.log('✅ Logged out')
  }

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    isStudent: currentUser?.role === 'student',
    isAdmin: currentUser?.role === 'admin',
    isMaster: currentUser?.role === 'master'
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
