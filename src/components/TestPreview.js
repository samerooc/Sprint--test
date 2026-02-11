import React, { useState } from 'react'
import { uploadImage } from '../utils/uploadImage'
import { createTest } from '../utils/database'
import './TestPreview.css'

function TestPreview({ testJSON, onPublish, onCancel }) {
  const [testData, setTestData] = useState(testJSON)
  const [uploading, setUploading] = useState({})

  const handleImageUpload = async (questionId, imageType, file) => {
    const key = `${questionId}_${imageType}`
    
    try {
      setUploading(prev => ({ ...prev, [key]: true }))
      
      const folder = `test_${testData.testTitle.replace(/\s+/g, '_')}/q${questionId}`
      const result = await uploadImage(file, folder)
      
      setTestData(prev => {
        const updated = { ...prev }
        const question = updated.questions.find(q => q.id === questionId)
        
        if (imageType === 'question') {
          question.questionImageUrl = result.url
          question.questionImageId = result.publicId
        } else {
          const optionKey = imageType.split('_')[1]
          if (typeof question.options[optionKey] === 'object') {
            question.options[optionKey].imageUrl = result.url
            question.options[optionKey].imageId = result.publicId
          }
        }
        
        return updated
      })
      
      alert('✅ Image uploaded!')
      
    } catch (error) {
      alert('❌ Error: ' + error.message)
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }))
    }
  }

  const isComplete = () => {
    return testData.questions.every(q => {
      if (q.hasQuestionImage && !q.questionImageUrl) return false
      
      return Object.values(q.options).every(opt => {
        if (typeof opt === 'object' && opt.hasImage && !opt.imageUrl) {
          return false
        }
        return true
      })
    })
  }

  const handlePublish = async () => {
    try {
      const dummyAdminId = '00000000-0000-0000-0000-000000000000'
      const published = await createTest(testData, dummyAdminId)
      alert(`✅ Test published!\nID: ${published.id}`)
      onPublish(published)
    } catch (error) {
      alert('❌ Publish failed: ' + error.message)
    }
  }
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h1>📝 Test Preview</h1>
        <button onClick={onCancel} className="btn-cancel">← Back</button>
      </div>

      <div className="test-info">
        <h2>{testData.testTitle}</h2>
        <div className="test-meta">
          <span>⏱️ {testData.duration} min</span>
          <span>📊 {testData.questions.length} questions</span>
        </div>
      </div>

      <div className="questions-container">
        {testData.questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <div className="q-header">
              <h3>Question {index + 1}</h3>
              <span className="marks">{q.marks} marks</span>
            </div>

            <p className="q-text">{q.question}</p>

            {q.hasQuestionImage && (
              <div className="image-upload-section">
                <div className="image-label">
                  📷 Image: <em>{q.questionImageDescription}</em>
                </div>
                
                {q.questionImageUrl ? (
                  <div className="uploaded-image">
                    <img src={q.questionImageUrl} alt="Question" />
                    <button 
                      onClick={() => {
                        const updated = { ...testData }
                        updated.questions.find(qu => qu.id === q.id).questionImageUrl = null
                        setTestData(updated)
                      }}
                      className="btn-change"
                    >
                      🔄 Change
                    </button>
                  </div>
                ) : (
                  <div className="upload-zone">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(q.id, 'question', e.target.files[0])}
                      id={`q-img-${q.id}`}
                      disabled={uploading[`${q.id}_question`]}
                    />
                    <label htmlFor={`q-img-${q.id}`} className="upload-label">
                      {uploading[`${q.id}_question`] ? '⏳ Uploading...' : '📤 Upload Image'}
                    </label>
                  </div>
                )}
              </div>
            )}

            <div className="options">
              {Object.entries(q.options).map(([key, option]) => (
                <div 
                  key={key} 
                  className={`option ${key === q.correctAnswer ? 'correct' : ''}`}
                >
                  <div className="option-header">
                    <strong>{key})</strong>
                    {typeof option === 'string' ? option : option.text}
                    {key === q.correctAnswer && <span className="badge">✓</span>}
                  </div>

                  {typeof option === 'object' && option.hasImage && (
                    <div className="option-image-section">
                      <small>🖼️ {option.imageDesc}</small>
                      
                      {option.imageUrl ? (
                        <img src={option.imageUrl} alt={`Option ${key}`} className="option-img" />
                      ) : (
                        <div className="upload-zone small">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(q.id, `option_${key}`, e.target.files[0])}
                            id={`opt-${q.id}-${key}`}
                            disabled={uploading[`${q.id}_option_${key}`]}
                          />
                          <label htmlFor={`opt-${q.id}-${key}`} className="upload-label small">
                            {uploading[`${q.id}_option_${key}`] ? '⏳' : '📤'}
                          </label>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {q.solution && (
              <div className="solution">
                <strong>💡 Solution:</strong>
                <p>{q.solution}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="preview-footer">
        {!isComplete() && (
          <p className="warning">⚠️ Upload all images first</p>
        )}
        
        <button
          onClick={handlePublish}
          disabled={!isComplete()}
          className={`btn-publish ${isComplete() ? '' : 'disabled'}`}
        >
          {isComplete() ? '✅ Publish to Supabase' : '⏳ Images Pending'}
        </button>
      </div>
    </div>
  )
}

export default TestPreview