const {
  MAIL_FROM,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
} = process.env;

export const emailConfig = {
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
};

export const emailFrom = MAIL_FROM;
