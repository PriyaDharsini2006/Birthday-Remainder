import { scheduleBirthdayEmailCron } from '../lib/cron';

// This function will be called when the server starts
export function initializeCronJobs() {
  console.log('Initializing cron jobs...');
  scheduleBirthdayEmailCron();
}

// Call this function when the server starts
initializeCronJobs();