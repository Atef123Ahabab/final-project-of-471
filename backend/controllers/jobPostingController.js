const JobPosting = require('../models/JobPosting');
const UserProfile = require('../models/UserProfile');
const EmailService = require('../services/emailService');
const User = require('../models/User');

// FEATURE 02: Job Posting & Management

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
};

/**
 * API 2.1: Create Job Posting
 * POST /api/jobs/create
 */
exports.createJobPosting = async (req, res) => {
  try {
    const {
      employerId,
      jobTitle,
      description,
      requiredSkills,
      qualifications,
      location,
      salary,
      jobType,
      experience,
      deadline,
    } = req.body;

    const normalizedRequiredSkills = normalizeStringArray(requiredSkills);
    const normalizedQualifications = normalizeStringArray(qualifications);

    // Validation
    if (!employerId || !jobTitle || !description || !location) {
      return res.status(400).json({
        success: false,
        message:
          'employerId, jobTitle, description, and location are required',
      });
    }

    if (normalizedRequiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'requiredSkills must be a non-empty array',
      });
    }

    const jobPosting = new JobPosting({
      employerId,
      jobTitle,
      description,
      requiredSkills: normalizedRequiredSkills,
      qualifications: normalizedQualifications,
      location,
      salary: salary || {},
      jobType: jobType || 'Full-Time',
      experience: experience || {},
      deadline: deadline || null,
      status: 'Open',
      applicantsCount: 0,
    });

    await jobPosting.save();

    // Send job alerts asynchronously
    setImmediate(async () => {
      try {
        const users = await UserProfile.find({ email: { $exists: true, $ne: '' } });
        for (const user of users) {
          await EmailService.sendJobAlert(user.email, jobPosting.jobTitle, jobPosting._id);
        }
      } catch (error) {
        console.error('Error sending job alerts:', error);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: {
        jobId: jobPosting._id,
        jobTitle: jobPosting.jobTitle,
        status: jobPosting.status,
        createdAt: jobPosting.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.2: Get Job Posting by ID
 * GET /api/jobs/:jobId
 */
exports.getJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.3: Get All Job Postings
 * GET /api/jobs
 */
exports.getAllJobPostings = async (req, res) => {
  try {
    const { status, location, jobType } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;

    const jobs = await JobPosting.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message,
    });
  }
};

/**
 * API 2.4: Get Jobs by Employer
 * GET /api/jobs/employer/:employerId
 */
exports.getEmployerJobs = async (req, res) => {
  try {
    const { employerId } = req.params;

    const jobs = await JobPosting.find({ employerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employer jobs',
      error: error.message,
    });
  }
};

/**
 * API 2.5: Update Job Posting
 * PUT /api/jobs/:jobId
 */
exports.updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      jobTitle,
      description,
      requiredSkills,
      qualifications,
      location,
      salary,
      jobType,
      experience,
      status,
      deadline,
    } = req.body;

    const updatePayload = {
      jobTitle: jobTitle || undefined,
      description: description || undefined,
      location: location || undefined,
      salary: salary || undefined,
      jobType: jobType || undefined,
      experience: experience || undefined,
      status: status || undefined,
      deadline: deadline || undefined,
      updatedAt: Date.now(),
    };

    if (requiredSkills !== undefined) {
      const normalizedRequiredSkills = normalizeStringArray(requiredSkills);
      if (normalizedRequiredSkills.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'requiredSkills must be a non-empty array when provided',
        });
      }
      updatePayload.requiredSkills = normalizedRequiredSkills;
    }

    if (qualifications !== undefined) {
      updatePayload.qualifications = normalizeStringArray(qualifications);
    }

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      updatePayload,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.6: Close Job Posting
 * PUT /api/jobs/:jobId/close
 */
exports.closeJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      { status: 'Closed', updatedAt: Date.now() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting closed successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error closing job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.7: Delete Job Posting
 * DELETE /api/jobs/:jobId
 */
exports.deleteJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByIdAndDelete(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting job posting',
      error: error.message,
    });
  }
};

/**
 * API 2.8: Search Jobs by Skills
 * POST /api/jobs/search/skills
 */
exports.searchJobsBySkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Skills array is required',
      });
    }

    const jobs = await JobPosting.find({
      status: 'Open',
      requiredSkills: { $in: skills },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message,
    });
  }
};

/**
 * API 2.9: Update Applicant Count
 * PUT /api/jobs/:jobId/apply
 */
exports.incrementApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      { $inc: { applicantsCount: 1 } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application recorded successfully',
      data: {
        jobId: job._id,
        applicantsCount: job.applicantsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording application',
      error: error.message,
    });
  }
};

const hasPremiumAccess = async (req) => {
  if (req.user?.sub === 'admin') return true;
  const userId = req.user?.sub ? String(req.user.sub) : '';
  if (!userId) return false;
  const user = await User.findById(userId).select('subscriptionPlan');
  const plan = user?.subscriptionPlan || 'free';
  return plan === 'premium' || plan === 'enterprise';
};

/**
 * FEATURE: Featured Jobs (Premium)
 * PUT /api/jobs/:jobId/feature
 */
exports.featureJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const allowed = await hasPremiumAccess(req);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Premium subscription required to feature jobs',
      });
    }

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      { isFeatured: true, featuredAt: new Date(), updatedAt: Date.now() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job added to featured jobs',
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error featuring job',
      error: error.message,
    });
  }
};

/**
 * FEATURE: Featured Jobs (Premium)
 * PUT /api/jobs/:jobId/unfeature
 */
exports.unfeatureJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const allowed = await hasPremiumAccess(req);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        code: 'SUBSCRIPTION_REQUIRED',
        message: 'Premium subscription required to manage featured jobs',
      });
    }

    const job = await JobPosting.findByIdAndUpdate(
      jobId,
      { isFeatured: false, featuredAt: null, updatedAt: Date.now() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job removed from featured jobs',
      data: job,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error unfeaturing job',
      error: error.message,
    });
  }
};

/**
 * FEATURE: Featured Jobs
 * GET /api/jobs/featured
 */
exports.getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await JobPosting.find({ isFeatured: true }).sort({
      featuredAt: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching featured jobs',
      error: error.message,
    });
  }
};
