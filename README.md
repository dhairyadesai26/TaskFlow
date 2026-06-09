# 🚀 TaskFlow — Modern Full-Stack Task Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Brevo-Email-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" />
</p>

<p align="center">
  <strong>Task Assignment • Google OAuth • Real-Time Collaboration • Automated Email Notifications</strong>
</p>

<p align="center">
TaskFlow is a production-ready full-stack task management application built with Next.js, TypeScript, Flask, Supabase, and Brevo Email API.
</p>

---

# 📖 Overview

TaskFlow is a modern team collaboration platform that enables users to securely authenticate using Google OAuth, create and assign tasks to team members, track progress, and receive automated email notifications throughout the task lifecycle.

The application follows a scalable client-server architecture where the frontend communicates with a Flask REST API, which manages business logic, database interactions, and notification delivery.

Designed for performance, maintainability, and real-world deployment, TaskFlow demonstrates modern full-stack engineering practices using industry-standard technologies.

---

# ✨ Core Features

## 🔐 Authentication & Security

* Google OAuth 2.0 Authentication
* Secure Supabase Session Management
* Protected Dashboard Access
* Persistent Login Sessions
* Row-Level Security (RLS)

---

## 👥 User Management

* Automatic User Registration
* User Profile Synchronization
* Team Member Directory
* Dynamic Task Assignment

---

## ✅ Task Management

* Create Tasks
* Assign Tasks to Other Users
* View Assigned Tasks
* Complete Tasks
* Delete Tasks
* Status Tracking

---

## 📧 Automated Notifications

TaskFlow automatically sends email notifications for important events:

### New Task Assigned

When a user receives a task:

```text
Task Created
     ↓
Flask Backend
     ↓
Brevo Email API
     ↓
Recipient Receives Email
```

### Task Completed

When a task is marked as completed:

```text
Task Completed
      ↓
Flask Backend
      ↓
Brevo Email API
      ↓
Task Creator Receives Email
```

---

## 🎨 User Experience

* Responsive Design
* Mobile Friendly
* Modern Dashboard UI
* Fast Loading Performance
* Clean User Workflow

---

# 🏗️ System Architecture

```text
┌─────────────────────┐
│     Next.js UI      │
│  TypeScript Client  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Google OAuth 2.0  │
│    Supabase Auth    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Flask API       │
│  Business Logic     │
└──────────┬──────────┘
           │
           ├───────────────► Brevo Email API
           │                    │
           │                    ▼
           │              Email Delivery
           │
           ▼
┌─────────────────────┐
│      Supabase       │
│ PostgreSQL Database │
└─────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology      | Purpose           |
| --------------- | ----------------- |
| Next.js         | React Framework   |
| TypeScript      | Type Safety       |
| Tailwind CSS    | Styling           |
| Axios           | API Communication |
| Supabase Client | Authentication    |

---

## Backend

| Technology          | Purpose               |
| ------------------- | --------------------- |
| Flask               | REST API              |
| Flask-CORS          | Cross-Origin Requests |
| Python Dotenv       | Environment Variables |
| Supabase Python SDK | Database Operations   |
| Requests            | HTTP Client           |
| Brevo API           | Email Delivery        |

---

## Database

| Technology          | Purpose        |
| ------------------- | -------------- |
| Supabase PostgreSQL | Data Storage   |
| Row Level Security  | Access Control |

---

## Deployment

| Service  | Purpose                   |
| -------- | ------------------------- |
| Vercel   | Frontend Hosting          |
| Render   | Backend Hosting           |
| Supabase | Database & Authentication |
| Brevo    | Transactional Emails      |

---

# 📂 Project Structure

```text
TaskFlow
│
├── taskflow-frontend
│
│   ├── src
│   │
│   ├── app
│   │   ├── page.tsx
│   │   └── dashboard
│   │
│   ├── lib
│   │   ├── api.ts
│   │   └── supabase.ts
│   │
│   └── types
│
├── taskflow-backend
│
│   ├── app.py
│   │
│   ├── routes
│   │   └── tasks.py
│   │
│   ├── services
│   │   └── email_service.py
│   │
│   ├── utils
│   │   └── supabase_client.py
│   │
│   └── requirements.txt
│
├── migrations
│
├── .env.example
│
└── README.md
```

---

# 🗄️ Database Schema

## Users

```sql
create table users (
    id uuid primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    created_at timestamptz default now()
);
```

---

## Tasks

```sql
create table tasks (
    id uuid primary key default gen_random_uuid(),

    title text not null,

    description text,

    status text default 'pending',

    created_by uuid references users(id),

    assigned_to uuid references users(id),

    created_at timestamptz default now(),

    completed_at timestamptz
);
```

---

# 🔄 Application Workflow

## Authentication Flow

```text
User
 ↓
Google Login
 ↓
Supabase Auth
 ↓
Session Created
 ↓
Dashboard Access
```

---

## Task Creation Flow

```text
User Creates Task
        ↓
Frontend
        ↓
Flask API
        ↓
Supabase Database
        ↓
Brevo Notification Sent
```

---

## Task Completion Flow

```text
Task Completed
       ↓
Flask API
       ↓
Database Updated
       ↓
Completion Email Sent
```

---

# 🚀 Local Development Setup

## Clone Repository

```bash
git clone https://github.com/dhairyadesai26/TaskFlow.git

cd TaskFlow
```

---

# Frontend Setup

```bash
cd taskflow-frontend

npm install
```

Create:

`.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start Frontend:

```bash
npm run dev
```

---

# Backend Setup

```bash
cd taskflow-backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

Install Dependencies:

```bash
pip install -r requirements.txt
```

Create:

`.env`

```env
SUPABASE_URL=YOUR_SUPABASE_URL

SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

BREVO_API_KEY=YOUR_BREVO_API_KEY

FRONTEND_URL=http://localhost:3000

GMAIL_EMAIL=Your Email
```

Start Backend:

```bash
python app.py
```

---

# 🌐 Production Deployment

## Frontend (Vercel)

Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_API_URL=
```

---

## Backend (Render)

Environment Variables:

```env
SUPABASE_URL=

SUPABASE_SERVICE_KEY=

BREVO_API_KEY=

FRONTEND_URL=

GMAIL_EMAIL=
```

Start Command:

```bash
gunicorn app:app
```

---

# 📧 Why Brevo Instead of SMTP?

TaskFlow uses the Brevo Transactional Email API for reliable email delivery.

Benefits:

* Better Deliverability
* No SMTP Restrictions
* Cloud Deployment Friendly
* Faster Email Processing
* Production Ready
* Secure API-Based Integration

This approach avoids common SMTP limitations on cloud platforms while ensuring reliable notification delivery.




---

# 👨‍💻 Developer

**Dhairya Santosh Desai**

Computer Science Undergraduate
Full Stack Developer | Next.js | TypeScript | Flask | Supabase

GitHub: https://github.com/dhairyadesai26

---

# 📄 License

This project is licensed under the MIT License.

---

<p align="center">
Built with ❤️ using Next.js, Flask, Supabase, Brevo, and modern web technologies.
</p>
