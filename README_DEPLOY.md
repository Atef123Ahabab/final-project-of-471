Render + MongoDB Atlas Deployment Guide
=====================================

This document describes step-by-step how to deploy the project frontend and backend using Render, and how to set up MongoDB Atlas.

1) Push the repository to GitHub

  ```bash
  cd /path/to/final-project-of-471-main
  git init
  git add .
  git commit -m "Prepare for deployment"
  # create a repo on GitHub and replace the URL below
  git remote add origin https://github.com/<your-user>/<your-repo>.git
  git push -u origin main
  ```

2) Create MongoDB Atlas cluster

  - Sign up at https://www.mongodb.com/cloud/atlas and create a free cluster.
  - In "Database Access" create a DB user and password.
  - In "Network Access" allow access from your IP (or 0.0.0.0/0 for demo).
  - Copy the connection string and replace <dbUser>, <dbPassword>, <dbname>.

3) Backend: Create a Render Web Service

  - Connect Render to the GitHub repo.
  - Create a new Web Service:
    - Name: resume-job-portal-backend
    - Branch: main
    - Root directory: backend
    - Environment: Node
    - Start Command: `npm start`
  - Add Environment Variables (in Render dashboard -> Environment):
    - `MONGODB_URI` = your Atlas connection string
    - `JWT_SECRET` = a strong random string
    - `RESEND_API_KEY` or `SENDGRID_API_KEY` if used
    - `NODE_ENV` = production
    - `FRONTEND_URL` = https://<your-frontend>.onrender.com

4) Frontend: Create a Render Static Site

  - Create a new Static Site on Render:
    - Name: resume-job-portal-frontend
    - Root directory: frontend
    - Build command: `npm install && npm run build`
    - Publish directory: `dist`
  - Add Environment Variable for the frontend build:
    - `VITE_API_BASE` = https://<your-backend>.onrender.com

5) File uploads note

  Render instances use ephemeral filesystem — uploaded files stored in `backend/uploads` will not be durable. For a production demo, configure S3 or another persistent storage and modify the upload logic to store files there.

6) Update CORS & API base

  - `backend/server.js` uses the `FRONTEND_URL` env var to restrict CORS. If you left `FRONTEND_URL` blank, CORS defaults to allow all origins.
  - `frontend/src/api.js` reads `import.meta.env.VITE_API_BASE` at build time to determine the API base URL. Add `VITE_API_BASE` in the frontend site settings on Render.

7) Test after deploy

  - Health check:
    ```bash
    curl https://<your-backend>.onrender.com/api/health
    ```
  - Open the frontend URL and test signup/login, resume upload, job apply flows.

8) Troubleshooting

  - MongoDB connection errors: verify `MONGODB_URI`, Atlas IP whitelist, and user credentials.
  - Port errors: Render provides a `$PORT` env var; the server listens on `process.env.PORT`.
  - Build errors: check Render logs for missing dependencies or build script failures.

9) Demo checklist (short)

  - Deploy backend and frontend on Render.
  - Create demo user and seed 3–5 sample job postings.
  - Copy deployed URLs to video description.

If you want, I can create a branch that applies optional improvements (S3 uploads integration and stricter CORS) — tell me and I will implement them.
