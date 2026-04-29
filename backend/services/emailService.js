const { Resend } = require('resend');
require('dotenv').config();

let resend = null;
const apiKey = process.env.RESEND_API_KEY;
if (apiKey && apiKey !== 'your_resend_api_key_here' && apiKey.startsWith('re_')) {
  resend = new Resend(apiKey);
}

class EmailService {
  static async sendEmail(to, subject, html) {
    if (!resend) {
      console.log(`Email would be sent to ${to} (API key not configured)`);
      return;
    }

    try {
      const data = await resend.emails.send({
        from: 'Resume Job Portal <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      });

      console.log(`Email sent to ${to}`, data);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  static async sendJobAlert(userEmail, jobTitle, jobId) {
    const subject = `New Job Alert: ${jobTitle}`;
    const html = `
      <h2>New Job Opportunity</h2>
      <p>A new job matching your interests has been posted: <strong>${jobTitle}</strong></p>
      <p><a href="http://localhost:1008/jobs/${jobId}">View Job Details</a></p>
      <p>Best regards,<br>Resume Job Portal Team</p>
    `;
    await this.sendEmail(userEmail, subject, html);
  }

  static async sendApplicationUpdate(applicantEmail, jobTitle, status) {
    const subject = `Application Update: ${jobTitle}`;
    const html = `
      <h2>Application Status Update</h2>
      <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
      <p>New Status: <strong>${status}</strong></p>
      <p>Best regards,<br>Resume Job Portal Team</p>
    `;
    await this.sendEmail(applicantEmail, subject, html);
  }

  static async sendInterviewReminder(applicantEmail, jobTitle, interviewDate) {
    const subject = `Interview Reminder: ${jobTitle}`;
    const html = `
      <h2>Interview Reminder</h2>
      <p>Your interview for <strong>${jobTitle}</strong> is scheduled for:</p>
      <p><strong>${interviewDate.toLocaleString()}</strong></p>
      <p>Please be prepared and arrive on time.</p>
      <p>Best regards,<br>Resume Job Portal Team</p>
    `;
    await this.sendEmail(applicantEmail, subject, html);
  }

  static async sendJobApplicationNotification(employerEmail, jobTitle, applicantName, applicantEmail, applicationId) {
    const subject = `New Job Application: ${jobTitle}`;
    const html = `
      <h2>New Job Application Received</h2>
      <p>You have received a new application for <strong>${jobTitle}</strong>.</p>
      <p><strong>Applicant Details:</strong></p>
      <ul>
        <li>Name: ${applicantName}</li>
        <li>Email: ${applicantEmail}</li>
      </ul>
      <p><a href="http://localhost:1008/api/jobs/${applicationId.split('-')[0]}/applications">View All Applications</a></p>
      <p>Best regards,<br>Resume Job Portal Team</p>
    `;
    await this.sendEmail(employerEmail, subject, html);
  }

  static async sendTestEmail(to) {
    const subject = 'Test Email from Resume Job Portal';
    const html = `
      <h2>Test Email</h2>
      <p>This is a test email to verify that the email service is working correctly.</p>
      <p>If you received this, the Resend API integration is successful!</p>
      <p>Best regards,<br>Resume Job Portal Team</p>
    `;
    await this.sendEmail(to, subject, html);
  }
}

module.exports = EmailService;