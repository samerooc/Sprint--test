import React, { useEffect, useState } from 'react'
import { testConnection } from './config/supabase'
import TestPreview from './components/TestPreview'
import './App.css'

function App() {
  const [showPreview, setShowPreview] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection()
      setConnected(isConnected)
    }
    checkConnection()
  }, [])

  const sampleJSON = {
    testTitle: "Physics - Light & Optics",
    duration: 60,
    questions: [
      {
        id: 1,
        question: "What phenomenon is shown in the diagram?",
        hasQuestionImage: true,
        questionImageDescription: "Ray diagram showing light refraction",
        options: {
          A: "Reflection",
          B: "Refraction",
          C: "Diffraction",
          D: "Dispersion"
        },
        correctAnswer: "B",
        solution: "Light bends when passing between media.",
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

  const handlePreview = () => {
    try {
      const parsed = jsonInput ? JSON.parse(jsonInput) : sampleJSON
      setShowPreview(true)
    } catch (error) {
      alert('Invalid JSON! ' + error.message)
    }
  }

  const handlePublish = (published) => {
    console.log('Published:', published)
    setShowPreview(false)
    setJsonInput('')
  }

  if (showPreview) {
    const testData = jsonInput ? JSON.parse(jsonInput) : sampleJSON
    return (
      <TestPreview
        testJSON={testData}
        onPublish={handlePublish}
        onCancel={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🎓 Test Creator</h1>
          <div className="status">
            {connected ? (
              <span className="badge success">✅ Connected</span>
            ) : (
              <span className="badge error">❌ Failed</span>
            )}
          </div>
        </div>

        <p className="subtitle">Paste JSON or load sample</p>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste test JSON here..."
          rows={12}
        />

        <div className="buttons">
          <button onClick={handlePreview} className="btn-preview">
            👁️ Preview Test
          </button>
          <button 
            onClick={() => setJsonInput(JSON.stringify(sampleJSON, null, 2))}
            className="btn-sample"
          >
            📋 Load Sample
          </button>
        </div>

        <div className="info-box">
          <h3>How to use:</h3>
          <ol>
            <li>Get JSON from Claude AI</li>
            <li>Paste here or load sample</li>
            <li>Preview test</li>
            <li>Upload images</li>
            <li>Publish to database</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App