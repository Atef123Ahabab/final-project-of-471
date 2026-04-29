const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, 'Please enter a valid phone number'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [2000, 'Summary cannot exceed 2000 characters'],
    },
    skills: {
      type: [String],
      default: [],
      set: (arr) => arr.map((s) => s.trim()).filter(Boolean),
    },
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        fieldOfStudy: { type: String, trim: true },
        startYear: { type: String, trim: true },
        endYear: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],
    experience: [
      {
        jobTitle: { type: String, trim: true },
        company: { type: String, trim: true },
        location: { type: String, trim: true },
        startDate: { type: String, trim: true },
        endDate: { type: String, trim: true },
        current: { type: Boolean, default: false },
        description: { type: String, trim: true },
      },
    ],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProfile', userProfileSchema);
