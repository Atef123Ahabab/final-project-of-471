const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const SKILL_KEYWORDS = [
  'javascript',
  'typescript',
  'node.js',
  'node',
  'react',
  'express',
  'mongodb',
  'sql',
  'python',
  'java',
  'c++',
  'c#',
  'html',
  'css',
  'docker',
  'aws',
  'git',
  'rest api',
  'graphql',
  'machine learning',
  'data analysis',
  'communication',
  'leadership',
  'problem solving',
];

const normalizeWhitespace = (text) =>
  String(text || '')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractSkillsFromText = (text) => {
  const content = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => content.includes(skill));
};

const extractExperienceFromText = (text) => {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const experienceLines = lines.filter((line) => {
    const lower = line.toLowerCase();
    return (
      lower.includes('experience') ||
      lower.includes('engineer') ||
      lower.includes('developer') ||
      lower.includes('intern') ||
      lower.includes('manager')
    );
  });

  return experienceLines.slice(0, 3).map((line) => ({
    jobTitle: '',
    company: '',
    duration: '',
    description: line,
  }));
};

const extractResumeText = async (filePath, fileType) => {
  if (fileType === 'txt' || fileType === 'rtf') {
    return fs.readFileSync(filePath, 'utf8');
  }

  if (fileType === 'pdf') {
    const pdfBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(pdfBuffer);
    return data.text || '';
  }

  if (fileType === 'docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }

  return '';
};

// FEATURE 01: Resume Upload & Parsing

/**
 * API 1.1: Upload Resume
 * POST /api/resumes/upload
 */
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { userId, fullName, email, phone } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Extract file type
    let fileType;
    if (req.file.mimetype.includes('pdf')) {
      fileType = 'pdf';
    } else if (req.file.mimetype.includes('word') || req.file.mimetype.includes('document')) {
      fileType = req.file.originalname.toLowerCase().includes('.docx') ? 'docx' : 'doc';
    } else if (req.file.mimetype.includes('text')) {
      fileType = 'txt';
    } else if (req.file.mimetype.includes('rtf')) {
      fileType = 'rtf';
    } else if (req.file.originalname.toLowerCase().includes('.gdoc')) {
      fileType = 'gdoc';
    } else if (req.file.originalname.toLowerCase().includes('.gsheet')) {
      fileType = 'gsheet';
    } else if (req.file.originalname.toLowerCase().includes('.gslides')) {
      fileType = 'gslides';
    } else {
      fileType = 'pdf'; // default fallback
    }

    let parsedText = '';
    let autoSkills = [];
    let autoExperience = [];
    let autoSummary = '';

    try {
      parsedText = await extractResumeText(req.file.path, fileType);
      autoSkills = extractSkillsFromText(parsedText);
      autoExperience = extractExperienceFromText(parsedText);
      autoSummary = normalizeWhitespace(parsedText).slice(0, 500);
    } catch (parseError) {
      console.warn('Automatic resume parsing failed:', parseError.message);
    }

    const resume = new Resume({
      userId,
      fileName: req.file.originalname,
      fileType,
      filePath: req.file.path,
      fullName: fullName || 'Not Provided',
      email: email || 'Not Provided',
      phone: phone || 'Not Provided',
      skills: autoSkills,
      experience: autoExperience,
      education: [],
      summary: autoSummary,
      rawText: parsedText,
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumeId: resume._id,
        fileName: resume.fileName,
        extractedSkills: resume.skills,
        extractedExperienceCount: resume.experience.length,
        uploadedAt: resume.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message,
    });
  }
};

/**
 * API 1.2: Parse Resume (Extract Skills & Experience)
 * POST /api/resumes/:resumeId/parse
 */
exports.parseResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { skills, experience, education, summary } = req.body;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      {
        skills: skills || [],
        experience: experience || [],
        education: education || [],
        summary: summary || '',
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume parsed successfully',
      data: {
        resumeId: resume._id,
        skills: resume.skills,
        experience: resume.experience,
        education: resume.education,
        summary: resume.summary,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error parsing resume',
      error: error.message,
    });
  }
};

/**
 * API 1.3: Get Resume by ID
 * GET /api/resumes/:resumeId
 */
exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message,
    });
  }
};

/**
 * API 1.4: Get All Resumes by User
 * GET /api/resumes/user/:userId
 */
exports.getUserResumes = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId }).sort({ uploadedAt: -1 });

    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message,
    });
  }
};

/**
 * API 1.5: Update Resume
 * PUT /api/resumes/:resumeId
 */
exports.updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { skills, experience, education, fullName, email, phone, summary } =
      req.body;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      {
        skills: skills || undefined,
        experience: experience || undefined,
        education: education || undefined,
        fullName: fullName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        summary: summary || undefined,
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating resume',
      error: error.message,
    });
  }
};

/**
 * API 1.6: Delete Resume
 * DELETE /api/resumes/:resumeId
 */
exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndDelete(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Delete file from server
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message,
    });
  }
};

/**
 * API 1.7: Download Resume File
 * GET /api/resumes/:resumeId/download
 */
exports.downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.download(resume.filePath, resume.fileName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading resume',
      error: error.message,
    });
  }
};
