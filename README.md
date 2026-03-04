# PlaceIQ — Full Stack Campus Placement Platform

Express + MongoDB backend + React + Tailwind CSS frontend.

## 📁 Project Structure

```
placeiq-fullstack/
├── server/                      ← Express + MongoDB API
│   ├── config/db.js             ← Mongoose connection
│   ├── models/
│   │   ├── Student.js           ← Student schema (with sub-docs)
│   │   ├── Admin.js             ← Admin schema
│   │   └── Interview.js         ← Interview experience schema
│   ├── routes/
│   │   ├── auth.js              ← Login / Register / Me
│   │   ├── students.js          ← Student CRUD + sub-documents
│   │   ├── interviews.js        ← Interview CRUD
│   │   └── admin.js             ← Admin stats
│   ├── middleware/
│   │   ├── auth.js              ← JWT protect / adminOnly
│   │   └── error.js             ← Global error handler
│   ├── seed.js                  ← Seeds DB with demo data
│   └── index.js                 ← Express entry point
│
└── client/                      ← React + Tailwind frontend
    └── src/
        ├── context/AuthContext.jsx   ← Global auth state + token management
        ├── hooks/useApi.js           ← Axios instance with JWT interceptor
        ├── components/
        │   ├── Icon.jsx
        │   ├── Modal.jsx
        │   ├── Sidebar.jsx
        │   ├── StatCard.jsx
        │   ├── ChatBubble.jsx
        │   └── Loader.jsx
        └── pages/
            ├── Login.jsx             ← Sign in + Register (student & admin)
            ├── InterviewExperiences.jsx
            ├── student/
            │   ├── Dashboard.jsx
            │   ├── Profile.jsx
            │   ├── Projects.jsx
            │   ├── Certifications.jsx
            │   ├── Internships.jsx
            │   ├── Achievements.jsx
            │   └── Chatbot.jsx
            └── admin/
                ├── Dashboard.jsx
                ├── Students.jsx
                └── Companies.jsx
```

## 🚀 Quick Start

### 1. Setup environment
```bash
cp server/.env.example server/.env
# Edit server/.env — set MONGO_URI if needed (defaults to localhost)
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start both servers
```bash
npm run dev
# Server → http://localhost:5000
# Client → http://localhost:5173
```

## 🔑 Demo Credentials (after seeding)

| Role    | Email                          | Password   |
|---------|--------------------------------|------------|
| Student | arjun@university.edu           | student123 |
| Student | priya@university.edu           | student123 |
| Student | rahul@university.edu           | student123 |
| Student | sneha@university.edu           | student123 |
| Admin   | admin@university.edu           | admin123   |
| Admin   | placement@university.edu       | admin123   |

## 🛠 API Routes

### Auth
| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| POST   | /api/auth/login               | Login (student/admin) |
| POST   | /api/auth/register/student    | Register student      |
| POST   | /api/auth/register/admin      | Register admin        |
| GET    | /api/auth/me                  | Get current user      |

### Students
| Method | Endpoint                                      | Access           |
|--------|-----------------------------------------------|-----------------|
| GET    | /api/students                                 | Admin: all / Student: self |
| GET    | /api/students/:id                             | Self or Admin   |
| PUT    | /api/students/:id                             | Self or Admin   |
| DELETE | /api/students/:id                             | Admin only      |
| POST   | /api/students/:id/projects                    | Self or Admin   |
| PUT    | /api/students/:id/projects/:pid               | Self or Admin   |
| DELETE | /api/students/:id/projects/:pid               | Self or Admin   |
| ...same pattern for certifications, internships, achievements...  |

### Interviews
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | /api/interviews       | Get all (with filters) |
| POST   | /api/interviews       | Create (auth required) |
| PUT    | /api/interviews/:id   | Owner or Admin         |
| DELETE | /api/interviews/:id   | Owner or Admin         |

### Admin
| Method | Endpoint         | Description      |
|--------|------------------|------------------|
| GET    | /api/admin/stats | Dashboard metrics|
