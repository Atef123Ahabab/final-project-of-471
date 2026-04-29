const UserProfile = require('../models/UserProfile');
const JobPosting = require('../models/JobPosting');

const RISK_LEVELS = ['Low', 'Medium', 'High'];

const normalizeRiskLevel = (value) => {
  if (!value) return 'Medium';
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'low') return 'Low';
  if (normalized === 'high') return 'High';
  return 'Medium';
};

const validateAdminId = (adminId, res) => {
  if (!adminId || !String(adminId).trim()) {
    res.status(400).json({
      success: false,
      message: 'adminId is required for admin actions',
    });
    return false;
  }
  return true;
};

exports.flagUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminId, reason, riskLevel, note } = req.body;

    if (!validateAdminId(adminId, res)) return;

    const normalizedRisk = normalizeRiskLevel(riskLevel);

    if (!RISK_LEVELS.includes(normalizedRisk)) {
      return res.status(400).json({
        success: false,
        message: 'riskLevel must be Low, Medium, or High',
      });
    }

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    profile.fraudStatus = {
      ...profile.fraudStatus,
      isFlagged: true,
      riskLevel: normalizedRisk,
      reason: reason ? String(reason).trim() : 'Suspicious activity reported',
      flaggedBy: String(adminId).trim(),
      flaggedAt: new Date(),
      reviewNotes: note ? String(note).trim() : '',
      history: [
        ...(profile.fraudStatus?.history || []),
        {
          action: 'FLAG',
          reason: reason ? String(reason).trim() : 'Suspicious activity reported',
          riskLevel: normalizedRisk,
          adminId: String(adminId).trim(),
          note: note ? String(note).trim() : '',
          timestamp: new Date(),
        },
      ],
    };

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'User account flagged successfully',
      data: {
        userId: profile.userId,
        fullName: profile.fullName,
        fraudStatus: profile.fraudStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error flagging user account',
      error: error.message,
    });
  }
};

exports.unflagUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { adminId, note } = req.body;

    if (!validateAdminId(adminId, res)) return;

    const profile = await UserProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    profile.fraudStatus = {
      ...profile.fraudStatus,
      isFlagged: false,
      reviewNotes: note ? String(note).trim() : profile.fraudStatus?.reviewNotes || '',
      history: [
        ...(profile.fraudStatus?.history || []),
        {
          action: 'UNFLAG',
          reason: 'Flag removed by admin',
          riskLevel: profile.fraudStatus?.riskLevel || 'Medium',
          adminId: String(adminId).trim(),
          note: note ? String(note).trim() : '',
          timestamp: new Date(),
        },
      ],
    };

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'User account unflagged successfully',
      data: {
        userId: profile.userId,
        fullName: profile.fullName,
        fraudStatus: profile.fraudStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error unflagging user account',
      error: error.message,
    });
  }
};

exports.flagJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { adminId, reason, riskLevel, note } = req.body;

    if (!validateAdminId(adminId, res)) return;

    const normalizedRisk = normalizeRiskLevel(riskLevel);

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    job.fraudStatus = {
      ...job.fraudStatus,
      isFlagged: true,
      riskLevel: normalizedRisk,
      reason: reason ? String(reason).trim() : 'Potential fake or spam job posting',
      flaggedBy: String(adminId).trim(),
      flaggedAt: new Date(),
      reviewNotes: note ? String(note).trim() : '',
      history: [
        ...(job.fraudStatus?.history || []),
        {
          action: 'FLAG',
          reason: reason ? String(reason).trim() : 'Potential fake or spam job posting',
          riskLevel: normalizedRisk,
          adminId: String(adminId).trim(),
          note: note ? String(note).trim() : '',
          timestamp: new Date(),
        },
      ],
    };

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job posting flagged successfully',
      data: {
        jobId: job._id,
        jobTitle: job.jobTitle,
        fraudStatus: job.fraudStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error flagging job posting',
      error: error.message,
    });
  }
};

exports.unflagJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { adminId, note } = req.body;

    if (!validateAdminId(adminId, res)) return;

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    job.fraudStatus = {
      ...job.fraudStatus,
      isFlagged: false,
      reviewNotes: note ? String(note).trim() : job.fraudStatus?.reviewNotes || '',
      history: [
        ...(job.fraudStatus?.history || []),
        {
          action: 'UNFLAG',
          reason: 'Flag removed by admin',
          riskLevel: job.fraudStatus?.riskLevel || 'Medium',
          adminId: String(adminId).trim(),
          note: note ? String(note).trim() : '',
          timestamp: new Date(),
        },
      ],
    };

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job posting unflagged successfully',
      data: {
        jobId: job._id,
        jobTitle: job.jobTitle,
        fraudStatus: job.fraudStatus,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error unflagging job posting',
      error: error.message,
    });
  }
};

exports.getFlaggedEntities = async (req, res) => {
  try {
    const [flaggedUsers, flaggedJobs] = await Promise.all([
      UserProfile.find({ 'fraudStatus.isFlagged': true })
        .select('userId fullName email fraudStatus updatedAt')
        .sort({ updatedAt: -1 }),
      JobPosting.find({ 'fraudStatus.isFlagged': true })
        .select('jobTitle employerId location status fraudStatus updatedAt')
        .sort({ updatedAt: -1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        flaggedUsers,
        flaggedJobs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching flagged entities',
      error: error.message,
    });
  }
};
