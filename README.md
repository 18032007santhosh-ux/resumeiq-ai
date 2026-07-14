# ResumeIQ AI

ResumeIQ AI is a production-ready, premium AI-powered career optimization suite designed to analyze, score, and upgrade resumes, generate tailored cover letters, run interactive mock interview sessions, and match candidates to their dream jobs with real-time feedback.

---

## 🚀 Key Features

*   **Deterministic ATS Parsing & Scoring**: Fast, local parsing of PDF/DOCX resumes returning accurate score metrics.
*   **AI Career Coach**: Interactive Gemini-powered chat companion built directly into the dashboard.
*   **GitHub Portfolio Diagnostic**: Scours repositories, README coverage, and code languages to ensure consistency with the uploaded resume.
*   **Tailored Cover Letter Generator**: Generates customized cover letters aligned to target companies and roles.
*   **Interactive Mock Interviews**: Generates behavioral and technical questions based on candidates' skills, scores responses, and stores transcripts.
*   **Profile, Security, & Theme Controls**: Comprehensive settings page for profile updates, secure password change, theme selection, and account deletion.

---

## 🛠 Tech Stack

### Frontend
*   **Core**: React (TypeScript), Vite
*   **Styling**: Glassmorphism via Vanilla Tailwind CSS
*   **Icons**: Lucide React
*   **Animations**: Framer Motion
*   **Client**: Axios

### Backend & Database
*   **Framework**: Node.js, Express.js
*   **Database**: MongoDB Atlas (via Mongoose)
*   **AI Engine**: Google Gemini API (`@google/genai`)
*   **Security**: Helmet, CORS, Express Rate Limit, bcryptjs, JSON Web Tokens (JWT)

---

## 📦 Installation & Local Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Gemini API Key

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating a `.env` file:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/resumeiq
    JWT_SECRET=your_jwt_signing_key_here
    GEMINI_API_KEY=your_gemini_api_key
    CLIENT_URL=http://localhost:5173
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the local dev server:
    ```bash
    npm run dev
    ```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| **POST** | `/api/auth/register` | Register a new user | No |
| **POST** | `/api/auth/login` | Authenticate user & get JWT | No |
| **PUT** | `/api/auth/profile` | Update profile information | Yes (JWT) |
| **PUT** | `/api/auth/password` | Change password | Yes (JWT) |
| **DELETE**| `/api/auth/account` | Permanent account deletion | Yes (JWT) |
| **GET** | `/api/dashboard/stats` | Fetch aggregate count statistics | Yes (JWT) |
| **POST** | `/api/resumes/upload` | Upload PDF/DOCX resume file | Yes (JWT) |
| **POST** | `/api/job/match` | Evaluate matching score for job description | Yes (JWT) |
| **POST** | `/api/interview/generate`| Generate custom interview questions | Yes (JWT) |
| **GET** | `/api/history` | Fetch analysis history timeline | Yes (JWT) |

---

## ☁️ Production Deployment Steps

### 1. MongoDB Atlas Setup
*   Create a free MongoDB database cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
*   Add a network security access rule for `0.0.0.0/32` (or allow Render server IPs).
*   Generate a cluster connection string and save it for the Render configuration.

### 2. Backend Deployment on Render
*   Create a new Web Service pointing to your repository on [Render](https://render.com).
*   Set the **Root Directory** to `backend`.
*   Set the **Build Command** to `npm install`.
*   Set the **Start Command** to `npm start`.
*   Add the following environment variables:
    *   `MONGO_URI`
    *   `JWT_SECRET`
    *   `GEMINI_API_KEY`
    *   `CLIENT_URL` (Points to the deployed Vercel frontend URL)

### 3. Frontend Deployment on Vercel
*   Import the repository into [Vercel](https://vercel.com).
*   Set the **Root Directory** to `frontend`.
*   Configure the output directory as `dist` (default for Vite).
*   Deploy! All routes and request endpoints adapt automatically to Render or local environment rules.
