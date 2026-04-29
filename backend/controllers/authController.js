const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const getAdminCredentialsFromEnv = () => {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const adminPassword = String(process.env.ADMIN_PASSWORD || '').trim();
  return { adminEmail, adminPassword };
};

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body || {};

    const normalizedEmail = normalizeEmail(email);
    const rawPassword = String(password || '');

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'email is required' });
    }

    if (!rawPassword || rawPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      fullName: fullName ? String(fullName).trim() : '',
      role: 'user',
      subscriptionPlan: 'free',
    });

    const token = signToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: {
        token,
        user: {
          userId: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan || 'free',
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const normalizedEmail = normalizeEmail(email);
    const rawPassword = String(password || '');

    if (!normalizedEmail || !rawPassword) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    // Admin login (credentials come from .env as requested)
    const { adminEmail, adminPassword } = getAdminCredentialsFromEnv();
    if (adminEmail && adminPassword && normalizedEmail === adminEmail) {
      if (rawPassword !== adminPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = signToken({
        sub: 'admin',
        role: 'admin',
        email: adminEmail,
      });

      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          token,
          user: {
            userId: 'admin',
            email: adminEmail,
            fullName: 'Administrator',
            role: 'admin',
            subscriptionPlan: 'enterprise',
          },
        },
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken({
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          userId: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan || 'free',
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

