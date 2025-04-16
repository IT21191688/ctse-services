import nodemailer from "nodemailer";
import logger from "../config/logger.config";

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `NaturaAyur <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error: any) {
    logger.error(`Error sending email: ${error.message}`);
    return false;
  }
}
