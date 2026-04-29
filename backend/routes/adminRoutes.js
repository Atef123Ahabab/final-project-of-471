const express = require('express');
const adminController = require('../controllers/adminController');
const fraudController = require('../controllers/fraudController');

const router = express.Router();

// Fraud & Spam Detection (Admin) — routed to dedicated controller
router.put('/users/:userId/flag', fraudController.flagUserAccount);
router.put('/users/:userId/unflag', fraudController.unflagUserAccount);
router.put('/jobs/:jobId/flag', fraudController.flagJobPosting);
router.put('/jobs/:jobId/unflag', fraudController.unflagJobPosting);
router.get('/flags', fraudController.getFlaggedEntities);

// System Monitoring (Admin)
router.get('/monitoring/analytics', adminController.getSystemAnalytics);
router.get('/monitoring/users/search', adminController.searchUsers);
router.get('/monitoring/jobs/search', adminController.searchJobPostings);
router.delete('/monitoring/users/:userId', adminController.deleteUser);
router.delete('/monitoring/jobs/:jobId', adminController.deleteJobPosting);

module.exports = router;