import express   from 'express'
import Student    from '../models/Student.js'
import Interview  from '../models/Interview.js'
import Admin      from '../models/Admin.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()
router.use(protect, adminOnly)

// GET /api/admin/stats  — dashboard metrics
router.get('/stats', async (req, res, next) => {
  try {
    const totalStudents   = await Student.countDocuments()
    const totalInterviews = await Interview.countDocuments()
    const activeUsers     = await Student.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    })

    // Batch placement data (mock calculation based on DB)
    const students = await Student.find().select('batch')
    const batchMap = {}
    students.forEach(s => {
      if (!s.batch) return
      if (!batchMap[s.batch]) batchMap[s.batch] = { total: 0, placed: 0 }
      batchMap[s.batch].total++
    })
    // Simulate placed count for demo
    Object.keys(batchMap).forEach(b => {
      batchMap[b].placed = Math.floor(batchMap[b].total * 0.75)
    })
    const batchData = Object.entries(batchMap).map(([batch, v]) => ({ batch, ...v }))

    const placementPct = totalStudents > 0
      ? Math.round((batchData.reduce((a, b) => a + b.placed, 0) / totalStudents) * 100)
      : 0

    res.json({ totalStudents, totalInterviews, placementPct, activeUsers, batchData })
  } catch (err) { next(err) }
})

// GET /api/admin/admins  — list all admins
router.get('/admins', async (req, res, next) => {
  try {
    const admins = await Admin.find().select('-password')
    res.json(admins)
  } catch (err) { next(err) }
})

export default router
