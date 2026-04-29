const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  applyJob,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');

// POST   /api/applications              - submit an application
router.post('/', applyJob);

// GET    /api/applications/my           - list logged-in user's applications
router.get('/my', auth, getUserApplications);

// GET    /api/applications/:userId      - list user's applications (legacy)
router.get('/:userId', getUserApplications);

// PATCH  /api/applications/:id/status  - update status
router.patch('/:id/status', updateApplicationStatus);

// DELETE /api/applications/:id         - withdraw application
router.delete('/:id', deleteApplication);

module.exports = router;
