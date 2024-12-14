// src/lib/cron.ts
import { sendBirthdayEmails } from './birthday-email-service';

export async function checkBirthdays() {
  try {
    await sendBirthdayEmails();
    console.log('Birthday email check completed');
  } catch (error) {
    console.error('Birthday email check failed:', error);
  }
}