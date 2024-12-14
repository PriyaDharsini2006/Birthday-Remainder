import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure your email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendBirthdayEmails() {
  try {
    const today = new Date();
    console.log('Current Date:', today);

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { 
            birthday: { 
              month: today.getMonth() + 1 
            } 
          },
          { 
            birthday: { 
              day: today.getDate() 
            } 
          }
        ]
      },
    });

    console.log('Users with birthday today:', users);

    if (users.length === 0) {
      console.log('No users found with birthday today');
      return;
    }

    for (const user of users) {
      try {
        console.log(`Sending email to: ${user.email}`);
        await transporter.sendMail({
          from: '"Birthday Wishes" <priyagalaxy2006@gmail.com>',
          to: user.email,
          subject: 'Happy Birthday! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>Happy Birthday, ${user.name}! 🎂</h1>
              <p>Debugging Info - Today's Date: ${today.toLocaleString()}</p>
              <p>Wishing you a fantastic day filled with joy, laughter, and wonderful memories!</p>
              <p>Enjoy your special day!</p>
            </div>
          `,
        });
        console.log(`Email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send email to ${user.email}:`, emailError);
      }
    }
  } catch (error) {
    console.error('Complete birthday email process failed:', error);
  }
}