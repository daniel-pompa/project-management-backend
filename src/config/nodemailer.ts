import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Build SMTP configuration dynamically from environment variables
const config = () => {
  return {
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Improve error tolerance with timeouts
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  };
};

// Create reusable transporter instance
export const transporter = nodemailer.createTransport(config());

// Verify connection when initializing
transporter.verify((error, success) => {
  if (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('SMTP connection verification failed:', error);
    } else {
      console.error('SMTP connection verification failed:', error.message);
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('SMTP server configured successfully');
    }
  }
});

export default transporter;
