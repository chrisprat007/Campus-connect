import express from 'express'
import mongoose from 'mongoose'
import SemanticDocument from '../models/SemanticDocument.js'
import Student from '../models/Student.js'
import { generateEmbedding } from '../services/embeddingService.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { generateGeminiResponse } from '../services/embeddingService.js'
const router = express.Router()

router.use(protect)

// 🔥 POST /api/semanticsearch/student
router.post('/student', async (req, res, next) => {
  try {
    const { query } = req.body

    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query is required' })
    }

    // 1️⃣ Generate embedding for student prompt
    const queryEmbedding = await generateEmbedding(query)

    // 2️⃣ Retrieve relevant semantic documents
    const vectorResults = await SemanticDocument.aggregate([
      {
        $vectorSearch: {
          index: 'semantic_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 200,
          limit: 8
        }
      },
      {
        $project: {
          content: 1,
          refModel: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      },
      {
        $sort: { score: -1 }
      }
    ])

    if (!vectorResults.length) {
      return res.json({
        message: "No relevant data found to build roadmap."
      })
    }

    // 3️⃣ Build context for Gemini (RAG)
    const contextText = vectorResults
      .map((doc, index) => {
        return `Relevant Data ${index + 1} (${doc.refModel}):
${doc.content}
`
      })
      .join('\n')

    // 4️⃣ Create structured AI prompt
    const currentStudent = await Student.findById(req.user)
      .populate('projects')
      .populate('certifications')
      .populate('internships')
      .populate('achievements')
    const aiPrompt = `
You are an intelligent career roadmap assistant.

==============================
CURRENT STUDENT PROFILE
==============================
Name: ${currentStudent.name}
Department: ${currentStudent.department}
Domain: ${currentStudent.domain}
CGPA: ${currentStudent.cgpa}
Batch: ${currentStudent.batch}

Projects:
${currentStudent.projects?.map(p => `- ${p.title}: ${p.description}`).join('\n') || "None"}

Certifications:
${currentStudent.certifications?.map(c => `- ${c.title} (${c.issuer})`).join('\n') || "None"}

Internships:
${currentStudent.internships?.map(i => `- ${i.role} at ${i.company}`).join('\n') || "None"}

Achievements:
${currentStudent.achievements?.map(a => `- ${a.title}`).join('\n') || "None"}


==============================
SIMILAR STUDENT DATA (REFERENCE ONLY)
==============================
The following information comes from OTHER students with similar skills or goals.
Use this ONLY as reference for patterns and insights.
DO NOT assume this belongs to the current student.

${contextText}


==============================
STUDENT QUESTION
==============================
"${query}"


==============================
INSTRUCTIONS
==============================
- Analyze ONLY the CURRENT STUDENT PROFILE as the main subject.
- Use SIMILAR STUDENT DATA only for inspiration and pattern detection.
- Identify skill gaps in the current student.
- Suggest practical improvements.
- Provide a structured roadmap:
    1. Immediate actions (1–2 months)
    2. Mid-term improvements (3–6 months)
    3. Long-term growth (6+ months)
- Be realistic and specific.
- Keep it structured and clear.
`;
    // 5️⃣ Get Gemini response
   
    const aiResponse = await generateGeminiResponse({
  prompt: aiPrompt
})

    res.json({
      roadmap: aiResponse,
      sourcesUsed: vectorResults.length
    })

  } catch (err) {
    console.error('Student Semantic Search Error:', err)
    next(err)
  }
})

router.use(adminOnly)


// 🔥 POST /api/semanticsearch/admin
router.post('/admin', async (req, res, next) => {
  try {
    const { query } = req.body

    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Query is required' })
    }

    // 1️⃣ Generate query embedding
    const queryEmbedding = await generateEmbedding(query)

    // 2️⃣ Vector search (document level)
    const vectorResults = await SemanticDocument.aggregate([
      {
        $vectorSearch: {
          index: 'semantic_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 300,
          limit: 30
        }
      },
      {
        $project: {
          owner: 1,
          content: 1,
          refModel: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      },
      {
        $sort: { score: -1 }
      }
    ])

    if (!vectorResults.length) {
      return res.json([])
    }

    // 3️⃣ Group by student (keep highest score per student)
    const bestMatchPerStudent = {}

    for (const doc of vectorResults) {
      const studentId = doc.owner.toString()

      if (
        !bestMatchPerStudent[studentId] ||
        doc.score > bestMatchPerStudent[studentId].score
      ) {
        bestMatchPerStudent[studentId] = {
          score: doc.score,
          content: doc.content,
          refModel: doc.refModel
        }
      }
    }

    const studentIds = Object.keys(bestMatchPerStudent)

    // 4️⃣ Fetch student details
    const students = await Student.find({
      _id: { $in: studentIds }
    }).select('name email phone batch department domain')

    // 5️⃣ Merge student info with best match
    const finalResults = students.map(student => {
      const match = bestMatchPerStudent[student._id.toString()]

      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        cgpa:student.cgpa,
        phone: student.phone,
        batch: student.batch,
        department: student.department,
        domain: student.domain,
        matchedContent: match?.content,
        score: match?.score
      }
    })

    // 6️⃣ Sort by score descending
    finalResults.sort((a, b) => b.score - a.score)

    res.json(finalResults)

  } catch (err) {
    console.error('Semantic Admin Search Error:', err)
    next(err)
  }
})

export default router