const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile } = require('../controllers/profileController');
const EmailService = require('../services/emailService');

// GET  /api/profile/:userId  - fetch profile
router.get('/:userId', getProfile);

// POST /api/profile           - create or update profile (upsert)
router.post('/', upsertProfile);

// PUT  /api/profile           - alias for upsert (same handler)
router.put('/', upsertProfile);

// POST /api/profile/test-email - send test email
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    await EmailService.sendTestEmail(email);
    res.status(200).json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send test email', error: error.message });
  }
});

module.exports = router;
