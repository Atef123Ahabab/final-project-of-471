const Application = require('../models/Application');
const JobApplication = require('../models/JobApplication');

// POST /api/applications  - apply to a job
const applyJob = async (req, res) => {
  try {
    const { userId, jobId, jobTitle, companyName } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ success: false, message: 'userId and jobId are required' });
    }

    const application = await Application.create({ userId, jobId, jobTitle, companyName });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    console.error('applyJob error:', error);

    // Duplicate key -> user already applied
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already applied to this job' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/applications/:userId  - list all applications for a user
const getUserApplications = async (req, res) => {
  try {
    // Get userId from authenticated user (req.user.sub) or from URL params
    const userId = req.user?.sub || req.params.userId;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not found' });
    }

    // Try to find applications by applicantId first
    let applications = await JobApplication.find({ applicantId: userId })
      .populate('jobId', 'jobTitle company location jobType status')
      .populate('resumeId', 'fileName')
      .sort({ appliedAt: -1 });

    // If no results, try searching by email (fallback for legacy data)
    if (applications.length === 0 && userEmail) {
      applications = await JobApplication.find({ email: userEmail })
        .populate('jobId', 'jobTitle company location jobType status')
        .populate('resumeId', 'fileName')
        .sort({ appliedAt: -1 });
    }

    // If still no results, fallback to the legacy `Application` collection.
    // Some parts of the project store minimal applications via POST /api/applications,
    // but the UI expects "my applications" to show them too.
    if (applications.length === 0) {
      const legacy = await Application.find({ userId })
        .populate('jobId', 'jobTitle location jobType status')
        .sort({ appliedAt: -1 });

      applications = legacy.map((item) => {
        const job = item.jobId && typeof item.jobId === 'object' ? item.jobId.toObject() : item.jobId;
        const jobWithCompany = job && typeof job === 'object'
          ? { ...job, company: item.companyName || job.company }
          : job;

        return {
          _id: item._id,
          jobId: jobWithCompany,
          resumeId: null,
          fullName: '',
          email: userEmail || '',
          phone: '',
          city: '',
          country: '',
          coverLetter: '',
          status: item.status || 'Applied',
          interviewDate: null,
          appliedAt: item.appliedAt || item.createdAt,
          updatedAt: item.updatedAt || item.createdAt,
          __source: 'legacy_application',
        };
      });
    }

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error('getUserApplications error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// PATCH /api/applications/:id/status  - update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const VALID = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];
    if (!VALID.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${VALID.join(', ')}` });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, message: 'Status updated', data: application });
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/applications/:id  - withdraw an application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('deleteApplication error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { applyJob, getUserApplications, updateApplicationStatus, deleteApplication };
