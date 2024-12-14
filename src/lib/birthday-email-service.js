// src/lib/birthday-email-service.ts
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
  const users = await prisma.user.findMany({
    where: {
      birthday: {
        month: today.getMonth() + 1,
        day: today.getDate(),
      },
    },
  });

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
  }
}