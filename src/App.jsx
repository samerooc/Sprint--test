import React from 'react'  
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'  
import { AuthProvider, useAuth } from './contexts/AuthContext'  
import { Login } from './pages/Login'  
import { StudentDashboard } from './pages/StudentDashboard'  
import { AdminDashboard } from './pages/AdminDashboard'  
import { MasterDashboard } from './pages/MasterDashboard'  
import { TakeTest } from './pages/TakeTest'  

// Protected Route Component  
const ProtectedRoute = ({ children, allowedRoles }) => {  
  const { currentUser } = useAuth()  

  if (!currentUser) {  
    return <Navigate to="/login" replace />  
  }  

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {  
    // Redirect to appropriate dashboard  
    if (currentUser.role === 'student') return <Navigate to="/student" replace />  
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />  
    if (currentUser.role === 'master') return <Navigate to="/master" replace />  
  }  

  return children  
}  

// Router Component  
const AppRouter = () => {  
  const { currentUser } = useAuth()  

  return (  
    <Routes>  
      {/* Login Route */}  
      <Route   
        path="/login"   
        element={  
          currentUser ? (  
            currentUser.role === 'student' ? <Navigate to="/student" replace /> :  
            currentUser.role === 'admin' ? <Navigate to="/admin" replace /> :  
            <Navigate to="/master" replace />  
          ) : (  
            <Login />  
          )  
        }   
      />  

      {/* Student Routes */}  
      <Route  
        path="/student"  
        element={  
          <ProtectedRoute allowedRoles={['student']}>  
            <StudentDashboard />  
          </ProtectedRoute>  
        }  
      />  

      {/* Admin Routes */}  
      <Route  
        path="/admin"  
        element={  
          <ProtectedRoute allowedRoles={['admin']}>  
            <AdminDashboard />  
          </ProtectedRoute>  
        }  
      />  

      {/* Master Routes */}  
      <Route  
        path="/master"  
        element={  
          <ProtectedRoute allowedRoles={['master']}>  
            <MasterDashboard />  
          </ProtectedRoute>  
        }  
      />  

      {/* Test Taking Route (All roles) */}  
      <Route  
        path="/test/:testId"  
        element={  
          <ProtectedRoute allowedRoles={['student', 'admin']}>  
            <TakeTest />  
          </ProtectedRoute>  
        }  
      />  

      {/* Default Route */}  
      <Route  
        path="/"  
        element={  
          currentUser ? (  
            currentUser.role === 'student' ? <Navigate to="/student" replace /> :  
            currentUser.role === 'admin' ? <Navigate to="/admin" replace /> :  
            <Navigate to="/master" replace />  
          ) : (  
            <Navigate to="/login" replace />  
          )  
        }  
      />  

      {/* 404 Route */}  
      <Route path="*" element={<Navigate to="/" replace />} />  
    </Routes>  
  )  
}  

// Main App Component  
function App() {  
  return (  
    <BrowserRouter>  
      <AuthProvider>  
        <AppRouter />  
      </AuthProvider>  
    </BrowserRouter>  
  )  
}  

export default App