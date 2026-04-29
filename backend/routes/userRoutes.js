const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/me', auth, userController.getMe);
router.put('/me/subscription', auth, userController.updateMySubscription);

module.exports = router;

