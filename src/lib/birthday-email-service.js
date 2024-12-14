import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBirthdayEmails() {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Get current month (1-based index)
    const currentDay = today.getDate();        // Get current day

    console.log('Current Month:', currentMonth); // Log current month
    console.log('Current Day:', currentDay);     // Log current day

    // Raw query to fetch users with today's birthday (month and day match)
    const users = await prisma.user.findMany({
      where: {
        birthday: {
          gte: new Date(today.getFullYear(), currentMonth - 1, currentDay, 0, 0, 0), // Start of today
          lt: new Date(today.getFullYear(), currentMonth - 1, currentDay + 1, 0, 0, 0), // Start of the next day
        },
      },
    });

    console.log('Users found:', users); // Log users found

    if (users.length === 0) {
      console.log('No birthdays today.');
      return;
    }

    for (const user of users) {
      if (!user.email || !user.name) {
        console.error(`Invalid user data: ${user.id}, missing email or name.`);
        continue;
      }

      const emailPayload = {
        from: '"Birthday Wishes" <birthday@yourcompany.com>',
        to: user.email,
        subject: 'Happy Birthday! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Happy Birthday, ${user.name}! 🎂</h1>
            <p>Wishing you a fantastic day filled with joy, laughter, and wonderful memories!</p>
            <p>Enjoy your special day!</p>
          </div>
        `,
      };

      console.log('Email Payload:', emailPayload);

      try {
        await transporter.sendMail(emailPayload);
        console.log(`Birthday email sent to: ${user.name}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Error sending birthday emails:', error);
  }
}
