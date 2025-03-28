import nodemailer from 'nodemailer';
import config from '../../../config';

const emailSender = async (email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Emperal Health Care" <mdyeasinrafi7@gamil.com>', // sender address
    to: email, // list of receivers
    subject: 'Reset Password Link', // Subject line
    // text: 'Hello world?', // plain text body
    html,
  });

  console.log('Message sent: %s', info.messageId);
};

export default emailSender;
