import cron from 'node-cron';
import { sendBirthdayEmails } from './birthday-email-service';

export function scheduleBirthdayEmailCron() {
  // Runs every day at 5:30 PM
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Running birthday email cron job at', new Date().toLocaleString());
      await sendBirthdayEmails();
      console.log('Birthday email check completed successfully');
    } catch (error) {
      console.error('Birthday email check failed:', error);
    }
  });
}