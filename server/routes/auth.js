import express        from 'express'
import jwt            from 'jsonwebtoken'
import Student        from '../models/Student.js'
import Admin          from '../models/Admin.js'
import { protect }    from '../middleware/auth.js'

const router = express.Router()

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// ── POST /api/auth/register/student ─────────────────────────────────────────
router.post('/register/student', async (req, res, next) => {
  try {
    const { name, email, password, phone, cgpa, batch, domain, department, resumeUrl } = req.body
    if (await Student.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' })

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const student  = await Student.create({ name, email, password, phone, cgpa, batch, domain, department, resumeUrl, avatar: initials })
    const token    = signToken(student._id, 'student')

    res.status(201).json({ token, role: 'student', user: { _id: student._id, name: student.name, email: student.email, avatar: student.avatar } })
  } catch (err) { next(err) }
})

// ── POST /api/auth/register/admin ────────────────────────────────────────────
router.post('/register/admin', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (await Admin.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' })

    const admin = await Admin.create({ name, email, password })
    const token = signToken(admin._id, 'admin')
    res.status(201).json({ token, role: 'admin', user: { _id: admin._id, name: admin.name, email: admin.email } })
  } catch (err) { next(err) }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    if (!email || !password || !role)
      return res.status(400).json({ message: 'email, password and role are required' })

    if (role === 'admin') {
      const admin = await Admin.findOne({ email }).select('+password')
      if (!admin || !(await admin.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' })
      const token = signToken(admin._id, 'admin')
      return res.json({ token, role: 'admin', user: { _id: admin._id, name: admin.name, email: admin.email } })
    }

    const student = await Student.findOne({ email }).select('+password')
    if (!student || !(await student.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(student._id, 'student')
    res.json({ token, role: 'student', user: { _id: student._id, name: student.name, email: student.email, avatar: student.avatar, department: student.department, batch: student.batch } })
  } catch (err) { next(err) }
})

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ role: req.role, user: req.user })
})

export default router
