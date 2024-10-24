import sendgrid from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export default sendgrid;
