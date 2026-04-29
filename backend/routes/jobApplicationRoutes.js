const express = require('express');
const jobApplicationController = require('../controllers/jobApplicationController');

const router = express.Router();

// FEATURE 03: Job Application Routes

/**
 * API 3.1: Apply for Job
 * POST /api/jobs/:jobId/apply
 * Body: { applicantId, resumeId, fullName, email, phone, coverLetter? }
 */
router.put('/:jobId/apply', jobApplicationController.applyForJob);

/**
 * API 3.2: Get Applications for a Job
 * GET /api/jobs/:jobId/applications
 */
router.get('/:jobId/applications', jobApplicationController.getJobApplications);

/**
 * API 3.3: Get Applications by Applicant
 * GET /api/applications/user/:applicantId
 */
router.get('/user/:applicantId', jobApplicationController.getUserApplications);

/**
 * API 3.4: Update Application Status
 * PUT /api/applications/:applicationId/status
 * Body: { status }
 */
router.put('/:applicationId/status', jobApplicationController.updateApplicationStatus);

/**
 * API 3.5: Delete Application
 * DELETE /api/applications/:applicationId
 */
router.delete('/:applicationId', jobApplicationController.deleteApplication);

module.exports = router;