const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret && String(secret).trim()) return String(secret);

  // Dev fallback so the app works out-of-the-box in class demos.
  // For production, always set JWT_SECRET.
  return 'dev-insecure-jwt-secret-change-me';
};

const signToken = (payload, options = {}) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: options.expiresIn || '7d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

module.exports = { signToken, verifyToken };

