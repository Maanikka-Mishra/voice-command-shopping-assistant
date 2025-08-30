const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Voice Shopping Assistant API is running' })
})

// Voice processing endpoint (placeholder for future AI integration)
app.post('/api/process-voice', (req, res) => {
  const { text } = req.body
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }
  
  // This would integrate with a more sophisticated NLP service in production
  const response = {
    processed: true,
    originalText: text,
    timestamp: new Date().toISOString()
  }
  
  res.json(response)
})

// Suggestions endpoint
app.get('/api/suggestions', (req, res) => {
  // Mock suggestions - in production this would come from a database or AI service
  const suggestions = [
    'organic milk',
    'whole grain bread',
    'fresh bananas',
    'free-range eggs',
    'local honey'
  ]
  
  res.json({ suggestions })
})

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Voice Shopping Assistant server running on port ${PORT}`)
  console.log(`📱 Open http://localhost:${PORT} in your browser`)
  console.log(`🔊 Voice recognition ready for shopping commands!`)
})
