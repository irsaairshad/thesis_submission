# Thesis Submission System — MERN Stack

## Tech Stack
- **M** — MongoDB (database)
- **E** — Express.js (backend framework)
- **R** — React.js (frontend)
- **N** — Node.js (runtime)

## Project Structure
```
thesis-mern/
├── backend/
│   ├── models/          # Mongoose schemas (User, Paper, Assignment, Review)
│   ├── routes/          # Express API routes
│   ├── middleware/       # JWT authentication middleware
│   ├── uploads/         # Uploaded thesis files stored here
│   ├── server.js        # Main server entry point
│   ├── create_admin.js  # Script to create admin account
│   └── .env             # Environment variables
└── frontend/
    └── src/
        ├── pages/       # All React pages
        ├── components/  # Navbar component
        └── context/     # Auth context (global login state)
```

## Setup Instructions

### 1. Install MongoDB
- Download from https://www.mongodb.com/try/download/community
- Start MongoDB service

### 2. Backend Setup
```bash
cd backend
npm install
```

Edit `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/thesis_submission
JWT_SECRET=change_this_to_any_random_long_string
```

Create admin account:
```bash
node create_admin.js
```

Start backend server:
```bash
npm run dev       # development (with auto-restart)
# OR
npm start         # production
```
Backend runs on: http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Login Credentials (after running create_admin.js)
- **Admin:** admin@thesis.com / admin123
- Register as Author or Reviewer through the Register page

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/papers/submit | Submit thesis (Author) |
| GET | /api/papers/my | Get author's papers |
| GET | /api/papers/all | Get all papers (Admin) |
| GET | /api/papers/status | Check paper status (Author) |
| GET | /api/papers/:id | View single paper |
| GET | /api/papers/download/:id | Download paper file |
| GET | /api/admin/reviewers | List all reviewers (Admin) |
| POST | /api/admin/assign | Assign reviewer to paper (Admin) |
| GET | /api/admin/users | List all users with search (Admin) |
| GET | /api/reviews/my-assignments | Reviewer's assigned papers |
| POST | /api/reviews/submit/:id | Submit review (Reviewer) |
| PUT | /api/users/update-info | Update user profile |
