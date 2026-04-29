const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    employerId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'At least one required skill is required',
      },
      required: true,
    },
    qualifications: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'],
      default: 'Full-Time',
    },
    experience: {
      min: Number, // in years
      max: Number, // in years
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'On Hold'],
      default: 'Open',
    },
    deadline: Date,
    applicantsCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    fraudStatus: {
      isFlagged: {
        type: Boolean,
        default: false,
      },
      riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
      },
      reason: {
        type: String,
        trim: true,
        default: '',
      },
      flaggedBy: {
        type: String,
        trim: true,
        default: '',
      },
      flaggedAt: {
        type: Date,
        default: null,
      },
      reviewNotes: {
        type: String,
        trim: true,
        default: '',
      },
      history: [
        {
          action: {
            type: String,
            enum: ['FLAG', 'UNFLAG'],
            required: true,
          },
          reason: { type: String, trim: true, default: '' },
          riskLevel: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
          },
          adminId: { type: String, trim: true, default: '' },
          note: { type: String, trim: true, default: '' },
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);
