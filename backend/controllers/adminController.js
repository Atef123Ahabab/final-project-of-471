const UserProfile = require('../models/UserProfile');
const JobPosting = require('../models/JobPosting');

// Fraud & Spam detection handlers moved to backend/controllers/fraudController.js

// System Monitoring
exports.getSystemAnalytics = async (req, res) => {
  try {
    const User = require('../models/User');
    const [totalUsers, totalJobs] = await Promise.all([
      User.countDocuments(),
      JobPosting.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching system analytics',
      error: error.message,
    });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const User = require('../models/User');

    if (!query || !String(query).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchTerm = String(query).trim();
    const users = await User.find({
      $or: [
        { email: { $regex: searchTerm, $options: 'i' } },
        { fullName: { $regex: searchTerm, $options: 'i' } },
      ],
    }).select('_id email fullName role subscriptionPlan createdAt').limit(50);

    return res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message,
    });
  }
};

exports.searchJobPostings = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !String(query).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchTerm = String(query).trim();
    const jobs = await JobPosting.find({
      $or: [
        { jobTitle: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } },
      ],
    }).select('_id jobTitle employerId location jobType status createdAt').limit(50);

    return res.status(200).json({
      success: true,
      data: jobs,
      count: jobs.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error searching job postings',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require('../models/User');

    if (!userId || !String(userId).trim()) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Also delete user profile if exists
    await UserProfile.deleteOne({ userId });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

exports.deleteJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId || !String(jobId).trim()) {
      return res.status(400).json({
        success: false,
        message: 'jobId is required',
      });
    }

    const job = await JobPosting.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
      data: {
        jobId: job._id,
        jobTitle: job.jobTitle,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting job posting',
      error: error.message,
    });
  }
};