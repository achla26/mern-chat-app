import nodemailer from "nodemailer";

const ENVIRONMENT = process.env.NODE_ENV || "test"; 

// Mailtrap Configuration (For Testing)
const mailtrapConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
};

// Gmail Configuration (For Production)
const gmailConfig = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD, // Use an App Password
  },
};


// Select the right configuration
export const mailClient = nodemailer.createTransport(
  ENVIRONMENT === "test" ? mailtrapConfig : gmailConfig
);

export const sender = process.env.SMTP_MAIL;
 