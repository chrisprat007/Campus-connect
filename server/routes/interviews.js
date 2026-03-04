import express   from 'express'
import Interview  from '../models/Interview.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

// GET /api/interviews  — everyone sees all interviews
router.get('/', async (req, res, next) => {
  try {
    const { company, difficulty, result, search } = req.query
    const filter = {}
    if (company)    filter.company    = new RegExp(company, 'i')
    if (difficulty) filter.difficulty = difficulty
    if (result)     filter.result     = result
    if (search) {
      filter.$or = [
        { company:  new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') },
        { tags:     new RegExp(search, 'i') },
        { content:  new RegExp(search, 'i') },
      ]
    }
    const interviews = await Interview.find(filter)
      .populate('student', 'name email avatar')
      .sort({ createdAt: -1 })
    res.json(interviews)
  } catch (err) { next(err) }
})

// GET /api/interviews/:id
router.get('/:id', async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id).populate('student', 'name email avatar')
    if (!interview) return res.status(404).json({ message: 'Interview not found' })
    res.json(interview)
  } catch (err) { next(err) }
})

// POST /api/interviews  — student or admin
router.post('/', async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      postedBy: req.role,
      author:   req.user.name,
    }
    if (req.role === 'student') data.student = req.user._id
    const interview = await Interview.create(data)
    res.status(201).json(interview)
  } catch (err) { next(err) }
})

// PUT /api/interviews/:id  — owner or admin
router.put('/:id', async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
    if (!interview) return res.status(404).json({ message: 'Interview not found' })

    // Only the original student-poster or admin can edit
    const isOwner = req.role === 'student' && interview.student?.toString() === req.user._id.toString()
    if (req.role !== 'admin' && !isOwner)
      return res.status(403).json({ message: 'Access denied' })

    const updated = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) { next(err) }
})

// DELETE /api/interviews/:id — owner or admin
router.delete('/:id', async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
    if (!interview) return res.status(404).json({ message: 'Interview not found' })

    const isOwner = req.role === 'student' && interview.student?.toString() === req.user._id.toString()
    if (req.role !== 'admin' && !isOwner)
      return res.status(403).json({ message: 'Access denied' })

    await Interview.findByIdAndDelete(req.params.id)
    res.json({ message: 'Interview deleted' })
  } catch (err) { next(err) }
})

export default router
