import { checkBirthdays } from '../lib/cron';

export default async function handler(req, res) {
  try {
    await checkBirthdays();
    res.status(200).send('Birthday email check completed');
  } catch (error) {
    res.status(500).send('Birthday email check failed');
  }
}
