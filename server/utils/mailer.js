import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;
