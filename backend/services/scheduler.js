const cron = require('node-cron');
const JobApplication = require('../models/JobApplication');
const EmailService = require('./emailService');

class SchedulerService {
  static start() {
    // Run daily at 9 AM to check for upcoming interviews
    cron.schedule('0 9 * * *', async () => {
      console.log('Checking for interview reminders...');
      await this.sendInterviewReminders();
    });
  }

  static async sendInterviewReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      const upcomingInterviews = await JobApplication.find({
        status: 'Interview Scheduled',
        interviewDate: {
          $gte: tomorrow,
          $lt: dayAfter,
        },
      }).populate('jobId', 'jobTitle');

      for (const application of upcomingInterviews) {
        await EmailService.sendInterviewReminder(
          application.email,
          application.jobId.jobTitle,
          application.interviewDate
        );
      }

      console.log(`Sent ${upcomingInterviews.length} interview reminders`);
    } catch (error) {
      console.error('Error sending interview reminders:', error);
    }
  }
}

module.exports = SchedulerService;