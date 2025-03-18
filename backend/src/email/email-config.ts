import nodemailer from 'nodemailer';
import { IUser } from '../modal/IUser';
import { config } from '../config/config';

export const sendEmail = (to: string, subject: string, html: string, attachments: any[] = []) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.EMAIL,
      pass: config.APP_PASSWORD,
    }
  });

  const mailOptions = {
    from: config.EMAIL,
    to: to,
    subject: subject,
    html: html,
    attachments: attachments, // Include attachments like logo
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }});
};


