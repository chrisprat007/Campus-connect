import express from 'express'
import Student from '../models/Student.js'
import SemanticDocument from '../models/SemanticDocument.js'
import { generateEmbedding } from '../services/embeddingService.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()
router.use(protect)

// ─────────────────────────────────────────────
// 🔥 Semantic Helpers
// ─────────────────────────────────────────────

const createOrUpdateSemantic = async ({
  ownerId,
  ownerModel,
  refId,
  refModel,
  content
}) => {
  const embedding = await generateEmbedding(content)
  console.log(embedding);
  await SemanticDocument.findOneAndUpdate(
    { refId },
    {
      owner: ownerId,
      ownerModel,
      refId,
      refModel,
      content,
      embedding
    },
    { upsert: true, new: true }
  )
}

const deleteSemantic = async (refId) => {
  await SemanticDocument.deleteOne({ refId })
}

// ════════════════════════════════════════════
// STUDENT PROFILE
// ════════════════════════════════════════════

router.get('/', async (req, res, next) => {
  try {
    if (req.role === 'admin') {
      const students = await Student.find().select('-password')
      return res.json(students)
    }
    const student = await Student.findById(req.user._id).select('-password')
    res.json(student)
  } catch (err) { next(err) }
})

router.get('/:studentId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId).select('-password')
    if (!student) return res.status(404).json({ message: 'Student not found' })

    res.json(student)
  } catch (err) { next(err) }
})

router.put('/:studentId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      { new: true, runValidators: true }
    ).select('-password')

    if (!student) return res.status(404).json({ message: 'Student not found' })

    res.json(student)
  } catch (err) { next(err) }
})

router.delete('/:studentId', adminOnly, async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId)
    await SemanticDocument.deleteMany({ owner: req.params.studentId })
    res.json({ message: 'Student deleted' })
  } catch (err) { next(err) }
})


// ════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════

router.get('/:studentId/projects', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).select('projects')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student.projects)
  } catch (err) { next(err) }
})

router.post('/:studentId/projects', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.projects.push(req.body)
    await student.save()

    const newProject = student.projects.at(-1)

    const content = `
${newProject.name}
${newProject.description || ''}
${(newProject.tech || []).join(' ')}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: newProject._id,
      refModel: 'Project',
      content
    })

    res.status(201).json(student.projects)
  } catch (err) { next(err) }
})

router.put('/:studentId/projects/:projectId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const item = student.projects.id(req.params.projectId)
    if (!item) return res.status(404).json({ message: 'Project not found' })

    Object.assign(item, req.body)
    await student.save()

    const content = `
${item.name}
${item.description || ''}
${(item.tech || []).join(' ')}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Project',
      content
    })

    res.json(student.projects)
  } catch (err) { next(err) }
})

router.delete('/:studentId/projects/:projectId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.projects.pull({ _id: req.params.projectId })
    await student.save()
    await deleteSemantic(req.params.projectId)

    res.json(student.projects)
  } catch (err) { next(err) }
})


// ════════════════════════════════════════════
// CERTIFICATIONS (GET + POST + PUT + DELETE)
// ════════════════════════════════════════════

router.get('/:studentId/certifications', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).select('certifications')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student.certifications)
  } catch (err) { next(err) }
})

router.post('/:studentId/certifications', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.certifications.push(req.body)
    await student.save()

    const item = student.certifications.at(-1)

    const content = `
${item.title}
${item.issuer || ''}
${item.date || ''}
${item.credential || ''}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Certification',
      content
    })

    res.status(201).json(student.certifications)
  } catch (err) { next(err) }
})

router.put('/:studentId/certifications/:certId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    const item = student.certifications.id(req.params.certId)
    Object.assign(item, req.body)
    await student.save()

    const content = `
${item.title}
${item.issuer || ''}
${item.date || ''}
${item.credential || ''}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Certification',
      content
    })

    res.json(student.certifications)
  } catch (err) { next(err) }
})

router.delete('/:studentId/certifications/:certId', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId)
    student.certifications.pull({ _id: req.params.certId })
    await student.save()
    await deleteSemantic(req.params.certId)
    res.json(student.certifications)
  } catch (err) { next(err) }
})


// SAME PATTERN for INTERNSHIPS and ACHIEVEMENTS (GET + POST + PUT + DELETE)
// (structure identical to certifications, only content text differs)
// ════════════════════════════════════════════
// INTERNSHIPS
// ════════════════════════════════════════════

router.get('/:studentId/internships', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).select('internships')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student.internships)
  } catch (err) { next(err) }
})

router.post('/:studentId/internships', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.internships.push(req.body)
    await student.save()

    const item = student.internships.at(-1)

    const content = `
${item.company}
${item.role || ''}
${item.description || ''}
${item.startDate || ''}
${item.endDate || ''}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Internship',
      content
    })

    res.status(201).json(student.internships)
  } catch (err) { next(err) }
})

router.put('/:studentId/internships/:internshipId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const item = student.internships.id(req.params.internshipId)
    if (!item) return res.status(404).json({ message: 'Internship not found' })

    Object.assign(item, req.body)
    await student.save()

    const content = `
${item.company}
${item.role || ''}
${item.description || ''}
${item.startDate || ''}
${item.endDate || ''}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Internship',
      content
    })

    res.json(student.internships)
  } catch (err) { next(err) }
})

router.delete('/:studentId/internships/:internshipId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.internships.pull({ _id: req.params.internshipId })
    await student.save()

    await deleteSemantic(req.params.internshipId)

    res.json(student.internships)
  } catch (err) { next(err) }
})

// ════════════════════════════════════════════
// ACHIEVEMENTS
// ════════════════════════════════════════════

router.get('/:studentId/achievements', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId).select('achievements')
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student.achievements)
  } catch (err) { next(err) }
})

router.post('/:studentId/achievements', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.achievements.push(req.body)
    await student.save()

    const item = student.achievements.at(-1)

    const content = `
${item.title}
${item.description || ''}
${item.date || ''}
${item.organization || ''}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Achievement',
      content
    })

    res.status(201).json(student.achievements)
  } catch (err) { next(err) }
})

router.put('/:studentId/achievements/:achievementId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    const item = student.achievements.id(req.params.achievementId)
    if (!item) return res.status(404).json({ message: 'Achievement not found' })

    Object.assign(item, req.body)
    await student.save()

    const content = `
${item.title}
${item.description || ''}
${item.date || ''}
${item.organization || ''}
`

    await createOrUpdateSemantic({
      ownerId: student._id,
      ownerModel: 'Student',
      refId: item._id,
      refModel: 'Achievement',
      content
    })

    res.json(student.achievements)
  } catch (err) { next(err) }
})

router.delete('/:studentId/achievements/:achievementId', async (req, res, next) => {
  try {
    if (req.role !== 'admin' && req.user._id.toString() !== req.params.studentId)
      return res.status(403).json({ message: 'Access denied' })

    const student = await Student.findById(req.params.studentId)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    student.achievements.pull({ _id: req.params.achievementId })
    await student.save()

    await deleteSemantic(req.params.achievementId)

    res.json(student.achievements)
  } catch (err) { next(err) }
})

export default router