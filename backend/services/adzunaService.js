const axios = require("axios");

const fetchJobs = async (role = "software developer") => {
  try {
    const response = await axios.get(
      "https://api.adzuna.com/v1/api/jobs/gb/search/1",
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what: role,
          results_per_page: 50
        }
      }
    );

    return response.data.results;

  } catch (error) {
    console.error("Adzuna API Error:", error.message);
    return [];
  }
};

// 🔥 FULL MARKET SKILL MAP (important fix)
const skillKeywords = {
  "JavaScript": "high",
  "TypeScript": "high",
  "React": "high",
  "Node.js": "high",
  "Python": "high",

  "Express": "medium",
  "MongoDB": "medium",
  "SQL": "medium",
  "AWS": "medium",
  "Docker": "medium",
  "Git": "medium",

  "HTML": "low",
  "CSS": "low"
};

// 🔥 FIXED: Always return FULL skill list with priority
const extractSkills = (jobs) => {
  const found = new Map();

  jobs.forEach(job => {
    const text = (
      (job.title || "") + " " +
      (job.description || "")
    ).toLowerCase();

    Object.keys(skillKeywords).forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        found.set(skill, {
          name: skill,
          priority: skillKeywords[skill]
        });
      }
    });
  });

  return Array.from(found.values());
};

// 🔥 NEW: Create FULL market baseline (VERY IMPORTANT FIX)
const getAllMarketSkills = () => {
  return Object.keys(skillKeywords).map(skill => ({
    name: skill,
    priority: skillKeywords[skill]
  }));
};

module.exports = {
  fetchJobs,
  extractSkills,
  getAllMarketSkills
};