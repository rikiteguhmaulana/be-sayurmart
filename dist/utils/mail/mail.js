"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMailHtml = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("../env"));
const transporter = nodemailer_1.default.createTransport({
    service: env_1.default.EMAIL_SMTP_SERVICE_NAME,
    host: env_1.default.EMAIL_SMTP_HOST,
    port: env_1.default.EMAIL_SMTP_PORT,
    secure: env_1.default.EMAIL_SMTP_SECURE,
    auth: {
        user: env_1.default.EMAIL_SMTP_USER,
        pass: env_1.default.EMAIL_SMTP_PASS,
    },
    requireTLS: true,
});
const sendMail = async ({ from, to, subject, html }) => {
    return await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
const renderMailHtml = async (template, data) => {
    return await ejs_1.default.renderFile(path_1.default.join(__dirname, `templates/${template}`), data);
};
exports.renderMailHtml = renderMailHtml;
