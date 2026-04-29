const AuditLog = require('../models/AuditLog');

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'authorization',
  'accessToken',
  'refreshToken',
]);

const clamp = (value, maxLength = 300) => {
  const text = String(value || '');
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const sanitize = (value, depth = 0) => {
  if (depth > 2) {
    return '[Truncated]';
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitize(item, depth + 1));
  }

  if (value && typeof value === 'object') {
    const output = {};
    Object.keys(value)
      .slice(0, 50)
      .forEach((key) => {
        if (SENSITIVE_KEYS.has(key.toLowerCase())) {
          output[key] = '[REDACTED]';
        } else {
          output[key] = sanitize(value[key], depth + 1);
        }
      });
    return output;
  }

  if (typeof value === 'string') {
    return clamp(value, 500);
  }

  return value;
};

const getActionType = (method, path) => {
  if (path.includes('/flag')) return 'FLAG';
  if (path.includes('/unflag')) return 'UNFLAG';
  if (method === 'POST') return 'CREATE';
  if (method === 'PUT' || method === 'PATCH') return 'UPDATE';
  if (method === 'DELETE') return 'DELETE';
  return 'WRITE';
};

const getEntityType = (path) => {
  if (path.includes('/resumes')) return 'Resume';
  if (path.includes('/jobs')) return 'JobPosting';
  if (path.includes('/profile')) return 'UserProfile';
  if (path.includes('/applications')) return 'Application';
  if (path.includes('/bookmarks')) return 'Bookmark';
  if (path.includes('/admin')) return 'AdminAction';
  return 'System';
};

module.exports = (req, res, next) => {
  if (!req.originalUrl.startsWith('/api') || !WRITE_METHODS.has(req.method)) {
    return next();
  }

  const startedAt = Date.now();

  res.on('finish', async () => {
    try {
      const actorId =
        req.headers['x-admin-id'] ||
        req.headers['x-user-id'] ||
        req.body.adminId ||
        req.body.userId ||
        req.body.applicantId ||
        'system';

      const actorRole = req.headers['x-actor-role'] || (req.headers['x-admin-id'] ? 'admin' : 'user');
      const endpoint = req.originalUrl.split('?')[0];

      const log = new AuditLog({
        actionType: getActionType(req.method, endpoint),
        entityType: getEntityType(endpoint),
        entityId: req.params.jobId || req.params.userId || req.params.id || req.params.resumeId || req.params.applicationId || '',
        actorId: String(actorId),
        actorRole: String(actorRole),
        method: req.method,
        endpoint,
        statusCode: res.statusCode,
        success: res.statusCode < 400,
        ipAddress: req.ip || req.socket?.remoteAddress || '',
        userAgent: clamp(req.headers['user-agent'] || '', 500),
        details: {
          durationMs: Date.now() - startedAt,
          query: sanitize(req.query),
          body: sanitize(req.body),
        },
      });

      await log.save();
    } catch (error) {
      console.error('Audit logging error:', error.message);
    }
  });

  next();
};