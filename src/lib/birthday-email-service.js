import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure your email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBirthdayEmails() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // Months are 0-indexed, so add 1
  const currentDay = today.getDate();

  // Get all users with birthdays today
  const users = await prisma.user.findMany({
    where: {
      birthday: {
        // Compare month and day of the birthday
        month: currentMonth,
        day: currentDay,
      },
    },
  });

  if (users.length === 0) {
    console.log('No birthdays today.');
    return;
  }

  for (const user of users) {
    await transporter.sendMail({
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
    });
    console.log(`Birthday email sent to: ${user.name}`);
  }
}
