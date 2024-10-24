import sendgrid from './sendgrid';
import nodemailer from 'nodemailer';

export const emailClient =
  process.env.NODE_ENV === 'production'
    ? sendgrid
    : nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
