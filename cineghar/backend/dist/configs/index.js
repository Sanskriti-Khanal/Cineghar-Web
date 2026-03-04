"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TMDB_IMAGE_BASE_URL = exports.TMDB_BASE_URL = exports.TMDB_ACCESS_TOKEN = exports.TMDB_API_KEY = exports.KHALTI_WEBSITE_URL = exports.KHALTI_BASE_URL = exports.KHALTI_SECRET_KEY = exports.FRONTEND_URL = exports.MAIL_FROM = exports.SMTP_PASS = exports.SMTP_USER = exports.SMTP_SECURE = exports.SMTP_PORT = exports.SMTP_HOST = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT
    ? parseInt(process.env.PORT)
    : 5050;
exports.MONGODB_URI = process.env.MONGODB_URI ||
    "mongodb://localhost:27017/cineghar";
exports.JWT_SECRET = process.env.JWT_SECRET || "cineghar-secret-key";
// Nodemailer / SMTP
exports.SMTP_HOST = process.env.SMTP_HOST || "smtp.example.com";
exports.SMTP_PORT = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT)
    : 587;
exports.SMTP_SECURE = process.env.SMTP_SECURE === "true";
exports.SMTP_USER = process.env.SMTP_USER || "";
exports.SMTP_PASS = process.env.SMTP_PASS || "";
exports.MAIL_FROM = process.env.MAIL_FROM || "noreply@example.com";
exports.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// Khalti ePayment
exports.KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "";
exports.KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";
exports.KHALTI_WEBSITE_URL = process.env.KHALTI_WEBSITE_URL || exports.FRONTEND_URL;
// TMDB API Configuration
exports.TMDB_API_KEY = process.env.TMDB_API_KEY || "";
exports.TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || "";
exports.TMDB_BASE_URL = "https://api.themoviedb.org/3";
exports.TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
