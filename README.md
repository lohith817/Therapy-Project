# Online Therapy & Counseling Platform (MERN Stack)

A secure teletherapy platform connecting licensed therapists with clients through video
consultations, private chat, appointment scheduling, mental health assessments, and a
resource library — built with MongoDB, Express.js, React.js, and Node.js.

## Tech Stack

- **Frontend:** React.js, Redux Toolkit, React Router, Tailwind CSS, Socket.io-client
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Socket.io, Twilio Video API
- **Auth:** JWT + bcrypt password hashing + OTP verification

## Project Structure

```
therapy-platform/
├── backend/
│   ├── models/        # User, Therapist, Appointment, Message, Assessment, Resource
│   ├── routes/         # auth, therapists, appointments, messages, assessments, resources, video
│   ├── controllers/    # business logic for each route group
│   ├── middleware/      # JWT auth, role-based authorization, error handling
│   ├── sockets/         # Socket.io real-time chat handler
│   ├── config/           # MongoDB connection
│   ├── utils/             # token & OTP generators
│   └── server.js
│
└── frontend/
    └── src/
        ├── pages/       # Home, Login, Register, TherapistList, TherapistProfile,
        │                # Dashboard, Chat, Assessment, ResourceLibrary
        ├── components/  # Navbar, TherapistCard, ProtectedRoute
        ├── redux/        # store + auth/therapist/appointment/chat slices
        ├── services/     # axios instance, socket.io client
        └── hooks/         # useAuth
```

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and (optional) Twilio credentials
npm run dev
```

The API runs on `http://localhost:5000` by default. MongoDB must be running locally
(`mongodb://localhost:27017/therapy_platform`) or point `MONGO_URI` to an Atlas cluster.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## Core Modules Implemented

| Module | Description |
|---|---|
| Authentication | Register/login as client, therapist, or admin; JWT auth; OTP verification; forgot/reset password |
| Therapist Management | Profile creation (qualifications, specialization, fees, availability); admin verification |
| Therapist Search | Filter by specialization, language, fee, rating |
| Appointment Booking | Select therapist → choose date/time → confirm → appointment created with a video room link |
| Video Consultation | Twilio Video token endpoint (`/api/video/token/:roomName`) — plug into `twilio-video` on the frontend |
| Private Chat | Real-time messaging via Socket.io with typing indicators & read receipts, persisted to MongoDB |
| Mental Health Assessment | Stress/anxiety/depression/mood sliders, stored per user, viewable by therapists |
| Resource Library | Articles, videos, wellness tips, exercises, self-help guides |
| Session History | Appointments dashboard for clients and therapists |

## REST API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/verify-otp | Verify OTP |
| POST | /api/auth/login | Login |
| POST | /api/auth/forgot-password | Request password reset |
| POST | /api/auth/reset-password/:token | Reset password |
| GET | /api/auth/me | Get logged-in profile |
| GET | /api/therapists | List/search therapists |
| GET | /api/therapists/:id | Get therapist profile |
| PUT | /api/therapists/profile | Create/update own therapist profile |
| PATCH | /api/therapists/:id/verify | Admin verifies therapist |
| POST | /api/appointments | Book appointment |
| GET | /api/appointments/my | Get my appointments |
| PATCH | /api/appointments/:id/status | Update appointment status |
| PATCH | /api/appointments/:id/notes | Add session notes |
| GET | /api/messages/:userId | Get chat history with a user |
| POST | /api/messages | Send message (REST fallback) |
| POST | /api/assessments | Submit assessment |
| GET | /api/assessments/my | Get my assessment history |
| GET | /api/assessments/client/:clientId | Therapist views client assessments |
| GET | /api/resources | List resources |
| POST | /api/resources | Create resource (admin/therapist) |
| GET | /api/video/token/:roomName | Get Twilio Video access token |

## Notes on Production Readiness

- Set strong values for `JWT_SECRET` and enable HTTPS in production.
- Twilio credentials are required for the `/api/video/token` route to work; without them
  the route returns a clear configuration error instead of crashing.
- OTP/reset emails are currently logged to the server console — wire up an email/SMS
  provider (e.g. Nodemailer, Twilio SMS) before going live.
- For HIPAA-aligned deployments, add encryption at rest, audit logging, and a signed BAA
  with your cloud/video providers.
