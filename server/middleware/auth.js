import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'
import Admin   from '../models/Admin.js'

// Attach user to req — works for both students and admins
export const protect = async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return res.status(401).json({ message: 'Not authorised, no token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id)
      req.role = 'admin'
    } else {
      req.user = await Student.findById(decoded.id)
      req.role = 'student'
    }
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' })
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}

// Only admins
export const adminOnly = (req, res, next) => {
  if (req.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
  next()
}

// Only the student themselves
export const studentSelf = (req, res, next) => {
  if (req.role === 'admin') return next()                        // admins can always pass
  if (req.user._id.toString() !== req.params.studentId) {
    return res.status(403).json({ message: 'Access denied' })
  }
  next()
}
