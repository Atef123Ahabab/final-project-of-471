const JobApplication = require('../models/JobApplication');
const JobPosting = require('../models/JobPosting');
const Resume = require('../models/Resume');
const UserProfile = require('../models/UserProfile');
const EmailService = require('../services/emailService');

// FEATURE 03: Job Application Management

/**
 * API 3.1: Apply for Job
 * PUT /api/jobs/:jobId/apply
 * Body: { applicantId, resumeId, fullName, email, phone, coverLetter? }
 */
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    // Extract applicantId from auth token
    const applicantId = req.user?.sub;
    const { resumeId, fullName, email, phone, city, country, coverLetter } = req.body;

    // Validation
    if (!applicantId || !resumeId || !fullName || !email || !phone || !city || !country) {
      return res.status(400).json({
        success: false,
        message: 'resumeId, fullName, email, phone, city, and country are required',
      });
    }

    // Check if job exists and is open
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'Job posting is not open for applications',
      });
    }

    // Check if resume exists
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Check if user already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Create application
    const application = new JobApplication({
      jobId,
      applicantId,
      resumeId,
      fullName,
      email,
      phone,
      city,
      country,
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    await application.save();

    // Increment applicants count
    await JobPosting.findByIdAndUpdate(jobId, {
      $inc: { applicantsCount: 1 },
    });

    // Send email notification to employer
    try {
      const employerProfile = await UserProfile.findOne({ userId: job.employerId });
      if (employerProfile && employerProfile.email) {
        await EmailService.sendJobApplicationNotification(
          employerProfile.email,
          job.jobTitle,
          fullName,
          email,
          application._id.toString()
        );
      }
    } catch (emailError) {
      console.error('Error sending job application notification:', emailError);
      // Don't fail the application submission if email fails
    }

    res.status(201).json({
      success: true,
      message: responseMessage,
      data: {
        applicationId: application._id,
        jobId,
        status: application.status,
        appliedAt: application.appliedAt,
        notification,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    });
  }
};

/**
 * API 3.2: Get Applications for a Job
 * GET /api/jobs/:jobId/applications
 */
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { startDate, endDate, sort, status } = req.query;

    // Check if job exists
    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    const filter = { jobId };
    if (startDate || endDate) {
      filter.appliedAt = {};
      if (startDate) filter.appliedAt.$gte = new Date(startDate);
      if (endDate) filter.appliedAt.$lte = new Date(endDate);
    }

    const statusFilter = status ? status.toString().trim() : '';
    if (statusFilter) {
      if (statusFilter === 'not_shortlisted') {
        filter.status = { $nin: ['Shortlisted'] };
      } else if (statusFilter.toLowerCase() !== 'all') {
        filter.status = statusFilter;
      }
    }

    const sortOrder = sort === 'oldest' ? { appliedAt: 1 } : { appliedAt: -1 };

    const applications = await JobApplication.find(filter)
      .populate('resumeId', 'fileName skills fullName email phone')
      .sort(sortOrder);

    res.status(200).json({
      success: true,
      data: {
        jobTitle: job.jobTitle,
        applications,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

/**
 * API 3.3: Get Applications by Applicant
 * GET /api/applications/user/:applicantId
 */
exports.getUserApplications = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const applications = await JobApplication.find({ applicantId })
      .populate('jobId', 'jobTitle company location salary status')
      .populate('resumeId', 'fileName')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user applications',
      error: error.message,
    });
  }
};

/**
 * API 3.4: Update Application Status
 * PUT /api/applications/:applicationId/status
 * Body: { status }
 */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, interviewDate } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Interview Scheduled', 'Shortlisted', 'Rejected', 'Accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    if (status === 'Interview Scheduled' && !interviewDate) {
      return res.status(400).json({
        success: false,
        message: 'interviewDate is required when scheduling an interview',
      });
    }

    const updateData = { status, updatedAt: new Date() };
    if (interviewDate) {
      updateData.interviewDate = new Date(interviewDate);
    }

    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true }
    ).populate('jobId', 'jobTitle');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Send email notifications
    const EmailService = require('../services/emailService');

    if (status === 'Accepted') {
      await EmailService.sendApplicationUpdate(
        application.email,
        application.jobId.jobTitle,
        status
      );
    } else if (status === 'Interview Scheduled') {
      await EmailService.sendApplicationUpdate(
        application.email,
        application.jobId.jobTitle,
        status
      );
      // Interview reminder will be sent automatically by scheduler
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message,
    });
  }
};

/**
 * API 3.5: Delete Application
 * DELETE /api/applications/:applicationId
 */
exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Decrement applicants count
    await JobPosting.findByIdAndUpdate(application.jobId, {
      $inc: { applicantsCount: -1 },
    });

    await JobApplication.findByIdAndDelete(applicationId);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message,
    });
  }
};