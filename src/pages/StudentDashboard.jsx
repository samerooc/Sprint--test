import React, { useState, useEffect } from 'react'  
import { useAuth } from '../contexts/AuthContext'  
import { getAllTests } from '../Utility/database'  
import { Button } from '../shared/Button'  
import { Card } from '../shared/Card'  
import { useNavigate } from 'react-router-dom'  
import './StudentDashboard.css'  
  
export const StudentDashboard = () => {  
  const { currentUser, logout } = useAuth()  
  const [tests, setTests] = useState([])  
  const [loading, setLoading] = useState(true)  
  const [filter, setFilter] = useState('all') // all, available, completed  
  const navigate = useNavigate()  
  
  useEffect(() => {  
    loadTests()  
  }, [])  
  
  const loadTests = async () => {  
    try {  
      setLoading(true)  
      const allTests = await getAllTests()  
      setTests(allTests)  
    } catch (error) {  
      console.error('Error loading tests:', error)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const handleStartTest = (testId) => {  
    navigate(`/test/${testId}`)  
  }  
  
  const handleViewResult = (testId) => {  
    navigate(`/result/${testId}`)  
  }  
  
  const filteredTests = tests.filter(test => {  
    // You can add logic here to filter based on completed tests  
    // For now, showing all tests  
    return true  
  })  
  
  return (  
    <div className="dashboard-container">  
      {/* Header */}  
      <header className="dashboard-header glass">  
        <div className="header-left">  
          <h1 className="header-title">🎓 Test Platform</h1>  
          <p className="header-subtitle">Student Dashboard</p>  
        </div>  
        <div className="header-right">  
          <div className="user-info">  
            <div className="user-avatar">  
              {currentUser?.name?.charAt(0).toUpperCase()}  
            </div>  
            <div className="user-details">  
              <p className="user-name">{currentUser?.name}</p>  
              <p className="user-role">Student</p>  
            </div>  
          </div>  
          <Button variant="ghost" onClick={logout}>  
            Logout  
          </Button>  
        </div>  
      </header>  
  
      {/* Main Content */}  
      <main className="dashboard-main">  
        <div className="dashboard-content">  
          {/* Welcome Card */}  
          <Card className="welcome-card">  
            <div className="welcome-content">  
              <div className="welcome-text">  
                <h2>Welcome back, {currentUser?.name}! 👋</h2>  
                <p>Ready to ace your tests today?</p>  
              </div>  
              <div className="welcome-stats">  
                <div className="stat-item">  
                  <span className="stat-value">{tests.length}</span>  
                  <span className="stat-label">Available Tests</span>  
                </div>  
                <div className="stat-item">  
                  <span className="stat-value">0</span>  
                  <span className="stat-label">Completed</span>  
                </div>  
                <div className="stat-item">  
                  <span className="stat-value">-</span>  
                  <span className="stat-label">Avg Score</span>  
                </div>  
              </div>  
            </div>  
          </Card>  
  
          {/* Filters */}  
          <div className="filter-bar glass">  
            <button  
              className={`filter-btn ${filter === 'all' ? 'filter-active' : ''}`}  
              onClick={() => setFilter('all')}  
            >  
              All Tests  
            </button>  
            <button  
              className={`filter-btn ${filter === 'available' ? 'filter-active' : ''}`}  
              onClick={() => setFilter('available')}  
            >  
              Available  
            </button>  
            <button  
              className={`filter-btn ${filter === 'completed' ? 'filter-active' : ''}`}  
              onClick={() => setFilter('completed')}  
            >  
              Completed  
            </button>  
          </div>  
  
          {/* Tests Grid */}  
          <div className="tests-section">  
            <h3 className="section-title">Available Tests</h3>  
              
            {loading ? (  
              <div className="loading-state">  
                <div className="spinner">⏳</div>  
                <p>Loading tests...</p>  
              </div>  
            ) : filteredTests.length === 0 ? (  
              <Card className="empty-state">  
                <div className="empty-content">  
                  <span className="empty-icon">📚</span>  
                  <h3>No tests available</h3>  
                  <p>Check back later for new tests!</p>  
                </div>  
              </Card>  
            ) : (  
              <div className="tests-grid">  
                {filteredTests.map((test) => (  
                  <Card key={test.id} className="test-card" hover>  
                    <div className="test-card-header">  
                      <div className="test-icon">📝</div>  
                      <div className="test-badge">New</div>  
                    </div>  
                      
                    <h4 className="test-title">{test.title}</h4>  
                      
                    <div className="test-meta">  
                      <div className="meta-item">  
                        <span className="meta-icon">⏱️</span>  
                        <span>{test.duration} min</span>  
                      </div>  
                      <div className="meta-item">  
                        <span className="meta-icon">📊</span>  
                        <span>{test.questions?.length || 0} questions</span>  
                      </div>  
                      <div className="meta-item">  
                        <span className="meta-icon">💯</span>  
                        <span>  
                          {test.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0} marks  
                        </span>  
                      </div>  
                    </div>  
  
                    <div className="test-actions">  
                      <Button  
                        variant="primary"  
                        fullWidth  
                        onClick={() => handleStartTest(test.id)}  
                      >  
                        Start Test  
                      </Button>  
                    </div>  
                  </Card>  
                ))}  
              </div>  
            )}  
          </div>  
  
          {/* Recent Activity */}  
          <div className="activity-section">  
            <h3 className="section-title">Recent Activity</h3>  
            <Card>  
              <div className="activity-list">  
                <div className="activity-item">  
                  <div className="activity-icon">🎯</div>  
                  <div className="activity-details">  
                    <p className="activity-text">You joined Test Platform</p>  
                    <p className="activity-time">Just now</p>  
                  </div>  
                </div>  
              </div>  
            </Card>  
          </div>  
        </div>  
      </main>  
    </div>  
  )  
}