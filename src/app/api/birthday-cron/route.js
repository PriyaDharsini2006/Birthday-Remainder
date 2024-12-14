import { checkBirthdays } from '../../../lib/cron';

export async function GET(req) {
  try {
    await checkBirthdays();
    return new Response('Birthday email check completed', { status: 200 });
  } catch (error) {
    return new Response('Birthday email check failed', { status: 500 });
  }
}
