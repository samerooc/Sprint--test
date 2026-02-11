import React, { useState, useEffect } from 'react'  
import { useParams, useNavigate } from 'react-router-dom'  
import { useAuth } from '../contexts/AuthContext'  
import { getTestById, submitResult } from '../Utility/database'  
import { Button } from '../shared/Button'  
import { Card } from '../shared/Card'  
import './TakeTest.css'  
  
export const TakeTest = () => {  
  const { testId } = useParams()  
  const navigate = useNavigate()  
  const { currentUser } = useAuth()  
    
  const [test, setTest] = useState(null)  
  const [loading, setLoading] = useState(true)  
  const [currentQuestion, setCurrentQuestion] = useState(0)  
  const [answers, setAnswers] = useState({})  
  const [timeLeft, setTimeLeft] = useState(0)  
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)  
  const [submitting, setSubmitting] = useState(false)  
  
  useEffect(() => {  
    loadTest()  
  }, [testId])  
  
  useEffect(() => {  
    if (timeLeft > 0) {  
      const timer = setTimeout(() => {  
        setTimeLeft(timeLeft - 1)  
      }, 1000)  
      return () => clearTimeout(timer)  
    } else if (timeLeft === 0 && test) {  
      handleSubmit()  
    }  
  }, [timeLeft])  
  
  const loadTest = async () => {  
    try {  
      setLoading(true)  
      const testData = await getTestById(testId)  
      setTest(testData)  
      setTimeLeft(testData.duration * 60) // Convert to seconds  
    } catch (error) {  
      console.error('Error loading test:', error)  
      alert('Failed to load test')  
      navigate(-1)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const handleAnswer = (questionId, answer) => {  
    setAnswers({  
      ...answers,  
      [questionId]: answer  
    })  
  }  
  
  const handleSubmit = async () => {  
    if (submitting) return  
      
    try {  
      setSubmitting(true)  
        
      // Calculate score  
      let score = 0  
      let totalMarks = 0  
        
      test.questions.forEach(q => {  
        totalMarks += q.marks  
        if (answers[q.id] === q.correctAnswer) {  
          score += q.marks  
        }  
      })  
        
      // Submit to database  
      await submitResult(  
        currentUser.id,  
        testId,  
        score,  
        totalMarks,  
        answers  
      )  
        
      alert(`✅ Test submitted!\n\nYour Score: ${score}/${totalMarks} (${((score/totalMarks)*100).toFixed(1)}%)`)  
      navigate(-1)  
        
    } catch (error) {  
      console.error('Submit error:', error)  
      alert('Failed to submit test. Please try again.')  
    } finally {  
      setSubmitting(false)  
    }  
  }  
  
  const formatTime = (seconds) => {  
    const mins = Math.floor(seconds / 60)  
    const secs = seconds % 60  
    return `${mins}:${secs.toString().padStart(2, '0')}`  
  }  
  
  const getAnsweredCount = () => {  
    return Object.keys(answers).length  
  }  
  
  if (loading) {  
    return (  
      <div className="test-container">  
        <div className="loading-state">  
          <div className="spinner">⏳</div>  
          <p>Loading test...</p>  
        </div>  
      </div>  
    )  
  }  
  
  if (!test) {  
    return null  
  }  
  
  const currentQ = test.questions[currentQuestion]  
  
  return (  
    <div className="test-container">  
      {/* Header */}  
      <header className="test-header glass">  
        <div className="test-info-bar">  
          <h2 className="test-name">{test.title}</h2>  
          <div className="test-meta-bar">  
            <div className="meta-item">  
              <span className="meta-icon">⏱️</span>  
              <span className={timeLeft < 300 ? 'time-warning' : ''}>  
                {formatTime(timeLeft)}  
              </span>  
            </div>  
            <div className="meta-item">  
              <span className="meta-icon">📊</span>  
              <span>{getAnsweredCount()}/{test.questions.length} answered</span>  
            </div>  
          </div>  
        </div>  
      </header>  
  
      {/* Question Navigator */}  
      <div className="question-navigator glass">  
        <div className="nav-label">Questions:</div>  
        <div className="nav-numbers">  
          {test.questions.map((q, idx) => (  
            <button  
              key={q.id}  
              className={`nav-number ${currentQuestion === idx ? 'nav-current' : ''} ${answers[q.id] ? 'nav-answered' : ''}`}  
              onClick={() => setCurrentQuestion(idx)}  
            >  
              {idx + 1}  
            </button>  
          ))}  
        </div>  
      </div>  
  
      {/* Main Question */}  
      <main className="test-main">  
        <Card className="question-container">  
          <div className="question-header">  
            <h3 className="question-number">Question {currentQuestion + 1}</h3>  
            <span className="question-marks">{currentQ.marks} marks</span>  
          </div>  
  
          <div className="question-text">  
            {currentQ.question}  
          </div>  
  
          {/* Question Image */}  
          {currentQ.questionImageUrl && (  
            <div className="question-image">  
              <img src={currentQ.questionImageUrl} alt="Question" />  
            </div>  
          )}  
  
          {/* Options */}  
          <div className="options-container">  
            {Object.entries(currentQ.options).map(([key, option]) => {  
              const isSelected = answers[currentQ.id] === key  
              const optionText = typeof option === 'string' ? option : option.text  
              const optionImage = typeof option === 'object' ? option.imageUrl : null  
  
              return (  
                <button  
                  key={key}  
                  className={`option-button ${isSelected ? 'option-selected' : ''}`}  
                  onClick={() => handleAnswer(currentQ.id, key)}  
                >  
                  <div className="option-header">  
                    <span className="option-key">{key}</span>  
                    <span className="option-text">{optionText}</span>  
                  </div>  
                  {optionImage && (  
                    <div className="option-image">  
                      <img src={optionImage} alt={`Option ${key}`} />  
                    </div>  
                  )}  
                  {isSelected && (  
                    <div className="option-check">✓</div>  
                  )}  
                </button>  
              )  
            })}  
          </div>  
  
          {/* Navigation Buttons */}  
          <div className="question-actions">  
            <Button  
              variant="secondary"  
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}  
              disabled={currentQuestion === 0}  
            >  
              ← Previous  
            </Button>  
  
            {currentQuestion === test.questions.length - 1 ? (  
              <Button  
                variant="success"  
                onClick={() => setShowSubmitConfirm(true)}  
              >  
                Submit Test  
              </Button>  
            ) : (  
              <Button  
                variant="primary"  
                onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}  
              >  
                Next →  
              </Button>  
            )}  
          </div>  
        </Card>  
      </main>  
  
      {/* Submit Confirmation Modal */}  
      {showSubmitConfirm && (  
        <div className="modal-overlay" onClick={() => setShowSubmitConfirm(false)}>  
          <Card className="modal-card" onClick={(e) => e.stopPropagation()}>  
            <h3>Submit Test?</h3>  
            <p className="modal-text">  
              You have answered {getAnsweredCount()} out of {test.questions.length} questions.  
            </p>  
            {getAnsweredCount() < test.questions.length && (  
              <p className="modal-warning">  
                ⚠️ {test.questions.length - getAnsweredCount()} questions are unanswered.  
              </p>  
            )}  
            <div className="modal-actions">  
              <Button  
                variant="ghost"  
                onClick={() => setShowSubmitConfirm(false)}  
              >  
                Cancel  
              </Button>  
              <Button  
                variant="success"  
                onClick={handleSubmit}  
                loading={submitting}  
              >  
                Confirm Submit  
              </Button>  
            </div>  
          </Card>  
        </div>  
      )}  
    </div>  
  )  
}