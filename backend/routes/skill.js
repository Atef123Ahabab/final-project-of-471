const express = require("express");
const router = express.Router();

const { analyzeSkills } = require("../controllers/skillController");
const auth = require('../middleware/auth');

router.get("/analyze-skills", auth, analyzeSkills);

module.exports = router;