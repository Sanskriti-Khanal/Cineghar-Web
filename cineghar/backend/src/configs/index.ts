import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 5050;

export const MONGODB_URI: string =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/cineghar";

export const JWT_SECRET: string =
  process.env.JWT_SECRET || "cineghar-secret-key";

// Nodemailer / SMTP
export const SMTP_HOST: string = process.env.SMTP_HOST || "smtp.example.com";
export const SMTP_PORT: number = process.env.SMTP_PORT
  ? parseInt(process.env.SMTP_PORT)
  : 587;
export const SMTP_SECURE: boolean = process.env.SMTP_SECURE === "true";
export const SMTP_USER: string = process.env.SMTP_USER || "";
export const SMTP_PASS: string = process.env.SMTP_PASS || "";
export const MAIL_FROM: string =
  process.env.MAIL_FROM || "noreply@example.com";
export const FRONTEND_URL: string =
  process.env.FRONTEND_URL || "http://localhost:3000";

// Khalti ePayment
export const KHALTI_SECRET_KEY: string = process.env.KHALTI_SECRET_KEY || "";
export const KHALTI_BASE_URL: string =
  process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";
export const KHALTI_WEBSITE_URL: string =
  process.env.KHALTI_WEBSITE_URL || FRONTEND_URL;

// TMDB API Configuration
export const TMDB_API_KEY: string = process.env.TMDB_API_KEY || "";
export const TMDB_ACCESS_TOKEN: string = process.env.TMDB_ACCESS_TOKEN || "";
export const TMDB_BASE_URL: string = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL: string = "https://image.tmdb.org/t/p/w500";