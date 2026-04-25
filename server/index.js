import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import connectDB  from './config/db.js'
import authRoutes      from './routes/auth.js'
import studentRoutes   from './routes/students.js'
import interviewRoutes from './routes/interviews.js'
import adminRoutes     from './routes/admin.js'
import semanticSearchRoutes from './routes/semanticSearch.js'
import { errorHandler, notFound } from './middleware/error.js'


await connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/students',   studentRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/admin',      adminRoutes)
app.use('/api/semanticsearch', semanticSearchRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date() }))

// ── Error handlers ─────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
