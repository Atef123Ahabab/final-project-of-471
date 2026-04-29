const mongoose = require('mongoose');

const VALID_STATUSES = ['Applied', 'Shortlisted', 'Interview', 'Rejected'];

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      },
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent a user from applying to the same job twice
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
