import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// src/app/layout.tsx

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { initializeCronJobs } from './cron';

export default function RootLayout({
  children,
}) {
  // Initialize cron jobs when the app starts
  initializeCronJobs();

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}