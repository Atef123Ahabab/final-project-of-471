const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('./config/database');
const resumeRoutes = require('./routes/resumeRoutes');
const jobPostingRoutes = require('./routes/jobPostingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const adminRoutes = require('./routes/adminRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const subscriptionsRoutes = require('./routes/subscriptionsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skill');
const auditLogger = require('./middleware/auditLogger');

const app = express();
const PORT = process.env.PORT || 1008;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
<<<<<<< HEAD
app.use(cors());
=======
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
};
app.use(cors(corsOptions));
>>>>>>> 07905ae (Prepare for Render deployment: CORS, API base, env example, deployment README)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auditLogger);

// Additional feature routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/skills', skillRoutes);
// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

const frontendDistDir = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistDir)) {
  app.use('/app', express.static(frontendDistDir));
  app.get('/app/*', (req, res) => {
    res.sendFile(path.join(frontendDistDir, 'index.html'));
  });
}

// Create uploads directory if it doesn't exist

const uploadsDir = path.join(__dirname, 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes

// FEATURE 01: Resume Upload & Parsing Routes
app.use('/api/resumes', resumeRoutes);

// FEATURE 02: Job Posting & Management Routes (includes FEATURE 03: Job Applications)
app.use('/api/jobs', jobPostingRoutes);

// FEATURE: Subscriptions Routes
app.use('/api/subscriptions', subscriptionsRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    port: PORT,
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message,
  });
});

// Start Server
const startServer = async () => {
  await connectDB();

  // Start email scheduler
  const SchedulerService = require('./services/scheduler');
  SchedulerService.start();

  app.listen(PORT, HOST, () => {
    console.log(`\n========================================`);
    console.log(`Server started successfully!`);
    console.log(`Host: ${HOST}`);
    console.log(`Port: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`========================================\n`);
    console.log(`Available Endpoints:`);
    console.log(`  - GET  http://localhost:${PORT}/api/health`);
    console.log(`  - GET  http://localhost:${PORT}/api/profile/:userId`);
    console.log(`  - POST http://localhost:${PORT}/api/profile`);
    console.log(`  - POST http://localhost:${PORT}/api/applications`);
    console.log(`  - POST http://localhost:${PORT}/api/bookmarks`);
    console.log(`  - PUT  http://localhost:${PORT}/api/admin/users/:userId/flag`);
    console.log(`  - PUT  http://localhost:${PORT}/api/admin/jobs/:jobId/flag`);
    console.log(`  - GET  http://localhost:${PORT}/api/admin/flags`);
    console.log(`  - GET  http://localhost:${PORT}/api/audit-logs`);
    console.log(`  - POST http://localhost:${PORT}/api/resumes/upload`);
    console.log(`  - GET  http://localhost:${PORT}/api/resumes/:resumeId`);
    console.log(`  - POST http://localhost:${PORT}/api/jobs/create`);
    console.log(`  - GET  http://localhost:${PORT}/api/jobs`);
    console.log(`  - PUT  http://localhost:${PORT}/api/jobs/:jobId/apply`);
    console.log(`  - POST http://localhost:${PORT}/api/jobs/search/skills`);
    console.log(`  - GET  http://localhost:${PORT}/api/jobs/:jobId/applications`);
    console.log(`  - PUT  http://localhost:${PORT}/api/jobs/applications/:applicationId/status`);
    console.log(`  - GET  http://localhost:${PORT}/api/applications/user/:applicantId`);
    console.log(`  - GET  http://localhost:${PORT}/api/subscriptions`);
    console.log(`  - PUT  http://localhost:${PORT}/api/subscriptions/:planId`);
    console.log(`  - GET  http://localhost:${PORT}/api/skills/analyze-skills?role=backend%20developer`);
    console.log(`\n`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
