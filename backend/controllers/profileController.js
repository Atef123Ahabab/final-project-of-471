const UserProfile = require('../models/UserProfile');

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const normalizeEducation = (value) => {
  return normalizeList(value)
    .map((item) => ({
      degree: item.degree ? String(item.degree).trim() : '',
      institution: item.institution ? String(item.institution).trim() : '',
      fieldOfStudy: item.fieldOfStudy ? String(item.fieldOfStudy).trim() : '',
      startYear: item.startYear ? String(item.startYear).trim() : '',
      endYear: item.endYear ? String(item.endYear).trim() : '',
      description: item.description ? String(item.description).trim() : '',
    }))
    .filter((item) => item.degree || item.institution || item.fieldOfStudy || item.startYear || item.endYear || item.description);
};

const normalizeExperience = (value) => {
  return normalizeList(value)
    .map((item) => ({
      jobTitle: item.jobTitle ? String(item.jobTitle).trim() : '',
      company: item.company ? String(item.company).trim() : '',
      location: item.location ? String(item.location).trim() : '',
      startDate: item.startDate ? String(item.startDate).trim() : '',
      endDate: item.endDate ? String(item.endDate).trim() : '',
      current: item.current === true || item.current === 'true' || item.current === '1' || item.current === 1,
      description: item.description ? String(item.description).trim() : '',
    }))
    .filter((item) => item.jobTitle || item.company || item.location || item.startDate || item.endDate || item.description || item.current);
};

const buildProfileUpdate = (body) => {
  const update = {};

  if (body.fullName !== undefined) update.fullName = String(body.fullName).trim();
  if (body.email !== undefined) update.email = String(body.email).trim();
  if (body.phone !== undefined) update.phone = String(body.phone).trim();
  if (body.address !== undefined) update.address = String(body.address).trim();
  if (body.summary !== undefined) update.summary = String(body.summary).trim();
  if (body.skills !== undefined) update.skills = normalizeList(body.skills);
  if (body.education !== undefined) update.education = normalizeEducation(body.education);
  if (body.experience !== undefined) update.experience = normalizeExperience(body.experience);

  return update;
};

// GET /api/profile/:userId
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// POST /api/profile  - create or fully replace
// PUT  /api/profile  - same upsert behaviour, convenient alias
const upsertProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const profileData = buildProfileUpdate(req.body);

    if (!profileData.fullName || profileData.fullName === '') {
      return res.status(400).json({ success: false, message: 'fullName is required' });
    }

    profileData.fullName = profileData.fullName.trim();

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, message: 'Profile saved successfully', data: profile });
  } catch (error) {
    console.error('upsertProfile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, upsertProfile };
