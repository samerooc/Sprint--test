import React, { useState, useEffect } from 'react'  
import { useAuth } from '../contexts/AuthContext'  
import { getAllTests } from '../Utility/database'  
import { Button } from '../shared/Button'  
import { Card } from '../shared/Card'  
import { useNavigate } from 'react-router-dom'  
import TestPreview from '../components/TestPreview'  
import './AdminDashboard.css'  
  
export const AdminDashboard = () => {  
  const { currentUser, logout } = useAuth()  
  const [tests, setTests] = useState([])  
  const [loading, setLoading] = useState(true)  
  const [view, setView] = useState('list') // list, create, preview  
  const [jsonInput, setJsonInput] = useState('')  
  const [testData, setTestData] = useState(null)  
  const navigate = useNavigate()  
  
  useEffect(() => {  
    loadTests()  
  }, [])  
  
  const loadTests = async () => {  
    try {  
      setLoading(true)  
      const allTests = await getAllTests()  
      // Filter tests created by current admin (in production)  
      setTests(allTests)  
    } catch (error) {  
      console.error('Error loading tests:', error)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const handleCreateTest = () => {  
    setView('create')  
    setJsonInput('')  
  }  
  
  const handlePreviewTest = () => {  
    try {  
      const parsed = JSON.parse(jsonInput)  
      setTestData(parsed)  
      setView('preview')  
    } catch (error) {  
      alert('Invalid JSON! Please check your format.\n\n' + error.message)  
    }  
  }  
  
  const handleLoadSample = () => {  
    const sampleJSON = {  
      testTitle: "Sample Physics Test",  
      duration: 60,  
      questions: [  
        {  
          id: 1,  
          question: "What is shown in the diagram?",  
          hasQuestionImage: true,  
          questionImageDescription: "Circuit diagram with resistors",  
          options: {  
            A: "Series circuit",  
            B: "Parallel circuit",  
            C: "Mixed circuit",  
            D: "Open circuit"  
          },  
          correctAnswer: "B",  
          solution: "The resistors are connected in parallel configuration.",  
          marks: 4  
        },  
        {  
          id: 2,  
          question: "Identify the lens type:",  
          hasQuestionImage: false,  
          options: {  
            A: {  
              text: "Convex lens",  
              hasImage: true,  
              imageDesc: "Convex lens diagram"  
            },  
            B: {  
              text: "Concave lens",  
              hasImage: true,  
              imageDesc: "Concave lens diagram"  
            },  
            C: "Plano-convex",  
            D: "Cylindrical"  
          },  
          correctAnswer: "A",  
          solution: "Convex lenses converge light rays.",  
          marks: 4  
        }  
      ]  
    }  
    setJsonInput(JSON.stringify(sampleJSON, null, 2))  
  }  
  
  const handlePublished = (publishedTest) => {  
    alert('✅ Test published successfully!')  
    setView('list')  
    setJsonInput('')  
    setTestData(null)  
    loadTests() // Reload tests list  
  }  
  
  const handleStartTest = (testId) => {  
    navigate(`/test/${testId}`)  
  }  
  
  // Render based on view  
  if (view === 'preview' && testData) {  
    return (  
      <div className="dashboard-container">  
        <header className="dashboard-header glass">  
          <h1 className="header-title">📝 Test Preview</h1>  
          <Button variant="ghost" onClick={() => setView('create')}>  
            ← Back to Editor  
          </Button>  
        </header>  
        <main className="dashboard-main">  
          <TestPreview  
            testJSON={testData}  
            onPublish={handlePublished}  
            onCancel={() => setView('create')}  
          />  
        </main>  
      </div>  
    )  
  }  
  
  if (view === 'create') {  
    return (  
      <div className="dashboard-container">  
        <header className="dashboard-header glass">  
          <div className="header-left">  
            <h1 className="header-title">📝 Create New Test</h1>  
            <p className="header-subtitle">Paste JSON from Claude AI</p>  
          </div>  
          <Button variant="ghost" onClick={() => setView('list')}>  
            ← Back to Dashboard  
          </Button>  
        </header>  
  
        <main className="dashboard-main">  
          <div className="editor-container">  
            <Card className="editor-card">  
              <div className="editor-header">  
                <h3>Test JSON Editor</h3>  
                <div className="editor-actions">  
                  <Button   
                    variant="secondary"   
                    size="small"  
                    onClick={handleLoadSample}  
                  >  
                    📋 Load Sample  
                  </Button>  
                  <Button   
                    variant="primary"   
                    size="small"  
                    onClick={handlePreviewTest}  
                    disabled={!jsonInput.trim()}  
                  >  
                    👁️ Preview Test  
                  </Button>  
                </div>  
              </div>  
  
              <textarea  
                className="json-editor"  
                value={jsonInput}  
                onChange={(e) => setJsonInput(e.target.value)}  
                placeholder={`Paste test JSON here...\n\nExample format:\n{\n  "testTitle": "Physics Test",\n  "duration": 60,\n  "questions": [...]\n}`}  
                rows={20}  
              />  
  
              <div className="editor-footer">  
                <div className="editor-info">  
                  <span className="info-icon">💡</span>  
                  <span>Tip: Upload PDF to Claude AI, get JSON, paste here, preview & publish!</span>  
                </div>  
              </div>  
            </Card>  
  
            <Card className="instructions-card">  
              <h3>📚 How to Create a Test</h3>  
              <ol className="instructions-list">  
                <li>  
                  <strong>Upload PDF to Claude AI</strong>  
                  <p>Go to claude.ai and upload your test PDF</p>  
                </li>  
                <li>  
                  <strong>Use this prompt:</strong>  
                  <pre className="prompt-code">  
{`Extract questions as JSON:  
{  
  "testTitle": "Test Name",  
  "duration": 60,  
  "questions": [{  
    "id": 1,  
    "question": "Question text",  
    "hasQuestionImage": true/false,  
    "questionImageDescription": "...",  
    "options": {  
      "A": "Option 1",  
      "B": "Option 2",  
      "C": "Option 3",  
      "D": "Option 4"  
    },  
    "correctAnswer": "A",  
    "solution": "Explanation",  
    "marks": 4  
  }]  
}`}  
                  </pre>  
                </li>  
                <li>  
                  <strong>Copy JSON response</strong>  
                  <p>Copy the JSON from Claude's response</p>  
                </li>  
                <li>  
                  <strong>Paste & Preview</strong>  
                  <p>Paste here, click Preview, upload images</p>  
                </li>  
                <li>  
                  <strong>Publish</strong>  
                  <p>Review and publish to make test live</p>  
                </li>  
              </ol>  
            </Card>  
          </div>  
        </main>  
      </div>  
    )  
  }  
  
  // Default: List view  
  return (  
    <div className="dashboard-container">  
      {/* Header */}  
      <header className="dashboard-header glass">  
        <div className="header-left">  
          <h1 className="header-title">👨‍🏫 Test Platform</h1>  
          <p className="header-subtitle">Admin Dashboard</p>  
        </div>  
        <div className="header-right">  
          <div className="user-info">  
            <div className="user-avatar admin-avatar">  
              {currentUser?.name?.charAt(0).toUpperCase()}  
            </div>  
            <div className="user-details">  
              <p className="user-name">{currentUser?.name}</p>  
              <p className="user-role">Admin</p>  
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
          {/* Stats Cards */}  
          <div className="stats-grid">  
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
                <p className="stat-label">Active Students</p>  
                <p className="stat-value">-</p>  
              </div>  
            </Card>  
  
            <Card className="stat-card">  
              <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>  
                📊  
              </div>  
              <div className="stat-info">  
                <p className="stat-label">Avg Score</p>  
                <p className="stat-value">-</p>  
              </div>  
            </Card>  
  
            <Card className="stat-card">  
              <div className="stat-icon" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>  
                ⏱️  
              </div>  
              <div className="stat-info">  
                <p className="stat-label">Completion Rate</p>  
                <p className="stat-value">-</p>  
              </div>  
            </Card>  
          </div>  
  
          {/* Action Bar */}  
          <div className="action-bar">  
            <h3 className="section-title">Your Tests</h3>  
            <Button   
              variant="primary"   
              icon="➕"  
              onClick={handleCreateTest}  
            >  
              Create New Test  
            </Button>  
          </div>  
  
          {/* Tests List */}  
          {loading ? (  
            <div className="loading-state">  
              <div className="spinner">⏳</div>  
              <p>Loading tests...</p>  
            </div>  
          ) : tests.length === 0 ? (  
            <Card className="empty-state">  
              <div className="empty-content">  
                <span className="empty-icon">📝</span>  
                <h3>No tests created yet</h3>  
                <p>Create your first test to get started!</p>  
                <Button   
                  variant="primary"   
                  onClick={handleCreateTest}  
                >  
                  Create Test  
                </Button>  
              </div>  
            </Card>  
          ) : (  
            <div className="tests-grid">  
              {tests.map((test) => (  
                <Card key={test.id} className="admin-test-card" hover>  
                  <div className="test-card-header">  
                    <div className="test-icon">📝</div>  
                    <div className="test-status published">Published</div>  
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
  
                  <div className="test-stats">  
                    <div className="test-stat-item">  
                      <span className="test-stat-value">0</span>  
                      <span className="test-stat-label">Attempts</span>  
                    </div>  
                    <div className="test-stat-item">  
                      <span className="test-stat-value">-</span>  
                      <span className="test-stat-label">Avg Score</span>  
                    </div>  
                  </div>  
  
                  <div className="test-actions">  
                    <Button  
                      variant="secondary"  
                      fullWidth  
                      onClick={() => handleStartTest(test.id)}  
                    >  
                      Preview Test  
                    </Button>  
                  </div>  
                </Card>  
              ))}  
            </div>  
          )}  
        </div>  
      </main>  
    </div>  
  )  
}