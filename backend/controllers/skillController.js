const Resume = require('../models/Resume');
const { fetchJobs, extractSkills, getAllMarketSkills } = require('../services/adzunaService');

const normalizeSkill = (value) => String(value || '').trim().toLowerCase();

const loadUserSkillsFromResumes = async (userId) => {
  if (!userId) return [];

  const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
  const skills = Array.isArray(latestResume?.skills) ? latestResume.skills : [];

  const unique = new Map();
  skills.forEach((skill) => {
    const key = normalizeSkill(skill);
    if (!key) return;
    if (!unique.has(key)) unique.set(key, String(skill).trim());
  });

  return Array.from(unique.values());
};

const analyzeSkills = async (req, res) => {
  try {
    const role = String(req.query.role || 'software developer').trim() || 'software developer';
    const userId = req.user?.sub || String(req.query.userId || '').trim();

    const userSkills = await loadUserSkillsFromResumes(userId);

    const jobs = await fetchJobs(role);
    const extracted = extractSkills(jobs);
    const marketSkills = extracted.length > 0 ? extracted : getAllMarketSkills();

    const userSkillSet = new Set(userSkills.map(normalizeSkill));

    const matchedSkills = marketSkills.filter((skill) =>
      userSkillSet.has(normalizeSkill(skill.name))
    );

    const missingSkills = marketSkills.filter(
      (skill) => !userSkillSet.has(normalizeSkill(skill.name))
    );

    const totalSkills = marketSkills.length;
    const matchPercent = totalSkills === 0 ? 0 : Math.round((matchedSkills.length / totalSkills) * 100);

    return res.status(200).json({
      success: true,
      message: 'Skill analysis completed',
      data: {
        role,
        userId: userId || null,
        userSkills,
        matchedSkills,
        missingSkills,
        totals: {
          matched: matchedSkills.length,
          missing: missingSkills.length,
          market: totalSkills,
          matchPercent,
        },
      },
    });
  } catch (error) {
    console.error('Skill analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error analyzing skills',
      error: error.message,
    });
  }
};

module.exports = { analyzeSkills };