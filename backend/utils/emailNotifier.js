const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'ahababatef14@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 0);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
const EMAIL_NOTIFY_ADMIN = String(process.env.EMAIL_NOTIFY_ADMIN || 'false').toLowerCase() === 'true';
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || EMAIL_USER;

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (!EMAIL_PASS) {
    return null;
  }

  const auth = {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  };

  if (SMTP_HOST && SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth,
    });
  } else {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth,
    });
  }

  return transporter;
}

async function sendApplicationNotifications({ applicantEmail, applicantName, jobTitle, companyName, applicationId }) {
  const mailer = getTransporter();

  if (!mailer) {
    return {
      sent: false,
      reason: 'EMAIL_PASS is not configured. Add Gmail App Password in backend .env',
    };
  }

  const from = `"Resume Job Portal" <${EMAIL_USER}>`;
  const subject = 'Application received';
  const safeApplicantName = applicantName || 'Applicant';
  const safeJobTitle = jobTitle || 'the selected role';
  const safeCompanyName = companyName || 'the employer';

  const applicantText = [
    `Hello ${safeApplicantName},`,
    '',
    `Your application has been received for ${safeJobTitle} at ${safeCompanyName}.`,
    `Application ID: ${applicationId}`,
    '',
    'Thank you for applying.',
  ].join('\n');

  const applicantHtml = `
    <p>Hello ${safeApplicantName},</p>
    <p>Your application has been received for <strong>${safeJobTitle}</strong> at <strong>${safeCompanyName}</strong>.</p>
    <p><strong>Application ID:</strong> ${applicationId}</p>
    <p>Thank you for applying.</p>
  `;

  await mailer.sendMail({
    from,
    to: applicantEmail,
    subject,
    text: applicantText,
    html: applicantHtml,
  });

  if (EMAIL_NOTIFY_ADMIN) {
    const adminText = [
      'New job application submitted.',
      `Applicant: ${safeApplicantName} (${applicantEmail})`,
      `Job: ${safeJobTitle}`,
      `Company: ${safeCompanyName}`,
      `Application ID: ${applicationId}`,
    ].join('\n');

    await mailer.sendMail({
      from,
      to: ADMIN_NOTIFY_EMAIL,
      subject: 'New application submitted',
      text: adminText,
    });
  }

  return {
    sent: true,
    adminCopySent: EMAIL_NOTIFY_ADMIN,
  };
}

module.exports = {
  sendApplicationNotifications,
};
