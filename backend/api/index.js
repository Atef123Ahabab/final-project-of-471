const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('../routes/authRoutes');
const jobPostingRoutes = require('../routes/jobPostingRoutes');
const resumeRoutes = require('../routes/resumeRoutes');
const adminRoutes = require('../routes/adminRoutes');
const auditLogRoutes = require('../routes/auditLogRoutes');
const profileRoutes = require('../routes/profileRoutes');
const applicationRoutes = require('../routes/applicationRoutes');
const bookmarkRoutes = require('../routes/bookmarkRoutes');

// Import middleware
const auditLogger = require('../middleware/auditLogger');
const authMiddleware = require('../middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
if (!global.mongooseConnection) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
  global.mongooseConnection = true;
}

// Audit Logger Middleware
app.use(auditLogger);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobPostingRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Export handler for Vercel
module.exports = app;
