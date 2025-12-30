import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// In-memory storage
let conversionHistory = []

// Routes
app.get('/api/data', (req, res) => {
  res.json([])
})

app.get('/api/history', (req, res) => {
  res.json(conversionHistory)
})

app.post('/api/history', (req, res) => {
  const entry = { id: Date.now(), ...req.body, timestamp: new Date().toISOString() }
  conversionHistory.push(entry)
  res.json(entry)
})

app.delete('/api/history/:id', (req, res) => {
  conversionHistory = conversionHistory.filter(h => h.id !== parseInt(req.params.id))
  res.json({ message: 'Deleted' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
