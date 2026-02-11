import React, { useState, useEffect } from 'react'  
import { useAuth } from '../contexts/AuthContext'  
import { getAllTests, getAllUsers, getAllResults } from '../Utility/database'  
import { Button } from '../shared/Button'  
import { Card } from '../shared/Card'  
import './MasterDashboard.css'  
  
export const MasterDashboard = () => {  
  const { currentUser, logout } = useAuth()  
  const [tests, setTests] = useState([])  
  const [users, setUsers] = useState([])  
  const [results, setResults] = useState([])  
  const [loading, setLoading] = useState(true)  
  const [activeTab, setActiveTab] = useState('overview') // overview, tests, users, results  
  
  useEffect(() => {  
    loadAllData()  
  }, [])  
  
  const loadAllData = async () => {  
    try {  
      setLoading(true)  
      const [testsData, usersData, resultsData] = await Promise.all([  
        getAllTests(),  
        getAllUsers(),  
        getAllResults()  
      ])  
      setTests(testsData)  
      setUsers(usersData)  
      setResults(resultsData)  
    } catch (error) {  
      console.error('Error loading data:', error)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const exportData = () => {  
    const data = {  
      tests,  
      users,  
      results,  
      exportedAt: new Date().toISOString()  
    }  
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })  
    const url = URL.createObjectURL(blob)  
    const a = document.createElement('a')  
    a.href = url  
    a.download = `platform-data-${Date.now()}.json`  
    a.click()  
  }  
  
  const studentCount = users.filter(u => u.role === 'student').length  
  const adminCount = users.filter(u => u.role === 'admin').length  
  const avgScore = results.length > 0   
    ? (results.reduce((sum, r) => sum + (r.score / r.total_marks * 100), 0) / results.length).toFixed(1)  
    : 0  
  
  return (  
    <div className="dashboard-container master-dashboard">  
      {/* Header */}  
      <header className="dashboard-header glass">  
        <div className="header-left">  
          <h1 className="header-title">👑 Test Platform</h1>  
          <p className="header-subtitle">Master Dashboard</p>  
        </div>  
        <div className="header-right">  
          <Button variant="secondary" onClick={exportData}>  
            📥 Export Data  
          </Button>  
          <div className="user-info">  
            <div className="user-avatar master-avatar">  
              {currentUser?.name?.charAt(0).toUpperCase()}  
            </div>  
            <div className="user-details">  
              <p className="user-name">{currentUser?.name}</p>  
              <p className="user-role">Master</p>  
            </div>  
          </div>  
          <Button variant="ghost" onClick={logout}>  
            Logout  
          </Button>  
        </div>  
      </header>  
  
      {/* Tabs */}  
      <div className="master-tabs glass">  
        <button  
          className={`master-tab ${activeTab === 'overview' ? 'master-tab-active' : ''}`}  
          onClick={() => setActiveTab('overview')}  
        >  
          📊 Overview  
        </button>  
        <button  
          className={`master-tab ${activeTab === 'tests' ? 'master-tab-active' : ''}`}  
          onClick={() => setActiveTab('tests')}  
        >  
          📝 Tests ({tests.length})  
        </button>  
        <button  
          className={`master-tab ${activeTab === 'users' ? 'master-tab-active' : ''}`}  
          onClick={() => setActiveTab('users')}  
        >  
          👥 Users ({users.length})  
        </button>  
        <button  
          className={`master-tab ${activeTab === 'results' ? 'master-tab-active' : ''}`}  
          onClick={() => setActiveTab('results')}  
        >  
          📈 Results ({results.length})  
        </button>  
      </div>  
  
      {/* Main Content */}  
      <main className="dashboard-main">  
        <div className="dashboard-content">  
          {loading ? (  
            <div className="loading-state">  
              <div className="spinner">⏳</div>  
              <p>Loading data...</p>  
            </div>  
          ) : (  
            <>  
              {/* Overview Tab */}  
              {activeTab === 'overview' && (  
                <>  
                  <div className="stats-grid master-stats">  
                    <Card className="stat-card">  
                      <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>  
                        📝  
                      </div>  
                      <div className="stat-info">  
                        <p className="stat-label">Total Tests</p>  
                        <p className="stat-value">{tests.length}</p>  
                      </div>  
                    </Card>  
  
                    <Card className="stat-card">  
                      <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>  
                        🎓  
                      </div>  
                      <div className="stat-info">  
                        <p className="stat-label">Students</p>  
                        <p className="stat-value">{studentCount}</p>  
                      </div>  
                    </Card>  
  
                    <Card className="stat-card">  
                      <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>  
                        👨‍🏫  
                      </div>  
                      <div className="stat-info">  
                        <p className="stat-label">Admins</p>  
                        <p className="stat-value">{adminCount}</p>  
                      </div>  
                    </Card>  
  
                    <Card className="stat-card">  
                      <div className="stat-icon" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>  
                        📊  
                      </div>  
                      <div className="stat-info">  
                        <p className="stat-label">Avg Score</p>  
                        <p className="stat-value">{avgScore}%</p>  
                      </div>  
                    </Card>  
                  </div>  
  
                  <div className="overview-grid">  
                    <Card title="Recent Activity">  
                      <div className="activity-list">  
                        {results.slice(0, 5).map((result, idx) => (  
                          <div key={idx} className="activity-item">  
                            <div className="activity-icon">📝</div>  
                            <div className="activity-details">  
                              <p className="activity-text">  
                                Test submitted - Score: {result.score}/{result.total_marks}  
                              </p>  
                              <p className="activity-time">  
                                {new Date(result.submitted_at).toLocaleDateString()}  
                              </p>  
                            </div>  
                          </div>  
                        ))}  
                        {results.length === 0 && (  
                          <p className="empty-text">No activity yet</p>  
                        )}  
                      </div>  
                    </Card>  
  
                    <Card title="Platform Health">  
                      <div className="health-metrics">  
                        <div className="health-item">  
                          <div className="health-label">Total Submissions</div>  
                          <div className="health-value">{results.length}</div>  
                        </div>  
                        <div className="health-item">  
                          <div className="health-label">Active Users</div>  
                          <div className="health-value">{users.length}</div>  
                        </div>  
                        <div className="health-item">  
                          <div className="health-label">Success Rate</div>  
                          <div className="health-value">  
                            {results.length > 0   
                              ? `${((results.filter(r => r.score/r.total_marks >= 0.4).length / results.length) * 100).toFixed(0)}%`  
                              : '-'  
                            }  
                          </div>  
                        </div>  
                      </div>  
                    </Card>  
                  </div>  
                </>  
              )}  
  
              {/* Tests Tab */}  
              {activeTab === 'tests' && (  
                <Card title="All Tests" subtitle={`${tests.length} tests created`}>  
                  <div className="master-table">  
                    <table>  
                      <thead>  
                        <tr>  
                          <th>Title</th>  
                          <th>Duration</th>  
                          <th>Questions</th>  
                          <th>Created</th>  
                          <th>Status</th>  
                        </tr>  
                      </thead>  
                      <tbody>  
                        {tests.map((test) => (  
                          <tr key={test.id}>  
                            <td className="table-title">{test.title}</td>  
                            <td>{test.duration} min</td>  
                            <td>{test.questions?.length || 0}</td>  
                            <td>{new Date(test.created_at).toLocaleDateString()}</td>  
                            <td>  
                              <span className="status-badge active">Active</span>  
                            </td>  
                          </tr>  
                        ))}  
                      </tbody>  
                    </table>  
                    {tests.length === 0 && (  
                      <div className="table-empty">  
                        <p>No tests created yet</p>  
                      </div>  
                    )}  
                  </div>  
                </Card>  
              )}  
  
              {/* Users Tab */}  
              {activeTab === 'users' && (  
                <Card title="All Users" subtitle={`${users.length} registered users`}>  
                  <div className="master-table">  
                    <table>  
                      <thead>  
                        <tr>  
                          <th>Name</th>  
                          <th>Email</th>  
                          <th>Role</th>  
                          <th>Phone</th>  
                          <th>Joined</th>  
                        </tr>  
                      </thead>  
                      <tbody>  
                        {users.map((user) => (  
                          <tr key={user.id}>  
                            <td className="table-title">{user.name}</td>  
                            <td>{user.email}</td>  
                            <td>  
                              <span className={`role-badge ${user.role}`}>  
                                {user.role === 'student' && '🎓'}  
                                {user.role === 'admin' && '👨‍🏫'}  
                                {user.role === 'master' && '👑'}  
                                {' '}{user.role}  
                              </span>  
                            </td>  
                            <td>{user.phone || '-'}</td>  
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>  
                          </tr>  
                        ))}  
                      </tbody>  
                    </table>  
                    {users.length === 0 && (  
                      <div className="table-empty">  
                        <p>No users yet</p>  
                      </div>  
                    )}  
                  </div>  
                </Card>  
              )}  
  
              {/* Results Tab */}  
              {activeTab === 'results' && (  
                <Card title="All Results" subtitle={`${results.length} test submissions`}>  
                  <div className="master-table">  
                    <table>  
                      <thead>  
                        <tr>  
                          <th>Test</th>  
                          <th>User</th>  
                          <th>Score</th>  
                          <th>Percentage</th>  
                          <th>Submitted</th>  
                        </tr>  
                      </thead>  
                      <tbody>  
                        {results.map((result) => (  
                          <tr key={result.id}>  
                            <td className="table-title">Test #{result.test_id?.slice(0, 8)}</td>  
                            <td>User #{result.user_id?.slice(0, 8)}</td>  
                            <td>{result.score}/{result.total_marks}</td>  
                            <td>  
                              <span className={`score-badge ${result.score/result.total_marks >= 0.4 ? 'pass' : 'fail'}`}>  
                                {((result.score/result.total_marks) * 100).toFixed(1)}%  
                              </span>  
                            </td>  
                            <td>{new Date(result.submitted_at).toLocaleString()}</td>  
                          </tr>  
                        ))}  
                      </tbody>  
                    </table>  
                    {results.length === 0 && (  
                      <div className="table-empty">  
                        <p>No submissions yet</p>  
                      </div>  
                    )}  
                  </div>  
                </Card>  
              )}  
            </>  
          )}  
        </div>  
      </main>  
    </div>  
  )  
}