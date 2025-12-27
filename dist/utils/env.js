"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    XENDIT_SECRET_API_KEY: process.env.XENDIT_SECRET_API_KEY,
    XENDIT_CALLBACK_TOKEN: process.env.XENDIT_CALLBACK_TOKEN,
    FRONTEND_URL: process.env.FRONTEND_URL,
    EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS,
    EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER,
    EMAIL_SMTP_PORT: Number(process.env.EMAIL_SMTP_PORT),
    EMAIL_SMTP_SECURE: process.env.EMAIL_SMTP_SECURE === "true",
    EMAIL_SMTP_SERVICE_NAME: process.env.EMAIL_SMTP_SERVICE_NAME,
    EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST,
};
