"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_schema_1 = require("../schema/auth.schema");
const zod_1 = require("zod");
const jwt_1 = require("../utils/jwt");
const mail_1 = require("../utils/mail/mail");
const env_1 = __importDefault(require("../utils/env"));
const cloudinary_1 = require("../utils/cloudinary");
exports.default = {
    async register(req, res) {
        const { name, username, email, address, phone, password, confirmPassword } = req.body;
        try {
            const validated = auth_schema_1.registerSchema.parse({
                name,
                username,
                email,
                address,
                phone,
                password,
                confirmPassword,
            });
            const userExists = await prisma_1.prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            email: validated.email,
                        },
                        {
                            username: validated.username,
                        },
                    ],
                },
            });
            if (userExists) {
                return res.status(400).json({
                    message: "User already exists",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(validated.password, 10);
            const activationCode = await bcryptjs_1.default.hash(validated.email, 10);
            console.log("Creating user in database...");
            const user = await prisma_1.prisma.user.create({
                data: {
                    name: validated.name,
                    username: validated.username,
                    email: validated.email,
                    phone: validated.phone,
                    password: hashedPassword,
                    address: validated.address,
                    activationCode,
                    isActive: true, // Auto-aktifkan untuk mempermudah development
                },
            });
            console.log("User created successfully with ID:", user.id);
            // mail
            try {
                console.log("Rendering mail HTML...");
                const contentMail = await (0, mail_1.renderMailHtml)("registration-success.ejs", {
                    name: user?.name,
                    email: user?.email,
                    createdAt: user?.createdAt,
                    activationLink: `${env_1.default.FRONTEND_URL}/auth/activation?code=${user.activationCode}`,
                });
                console.log("Sending activation mail to:", user?.email);
                await (0, mail_1.sendMail)({
                    from: env_1.default.EMAIL_SMTP_USER,
                    to: user?.email,
                    subject: "Aktivasi akun Anda",
                    html: contentMail,
                });
                console.log("Mail sent successfully!");
            }
            catch (mailError) {
                console.log("Error sending email:", mailError);
                // Kita tidak menghentikan proses registrasi hanya karena email gagal
            }
            delete user.password;
            return res.status(201).json({
                message: "User created successfully",
                data: user,
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            else {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async login(req, res) {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);
        try {
            const validated = auth_schema_1.loginSchema.parse({
                email,
                password,
            });
            console.log("Searching for user in database...");
            const userExists = await prisma_1.prisma.user.findFirst({
                where: {
                    AND: [
                        {
                            email: validated.email,
                        },
                        {
                            isActive: true,
                        },
                    ],
                },
            });
            if (!userExists) {
                console.log("User not found or not active:", email);
                return res.status(400).json({
                    message: "User not match in our record",
                });
            }
            console.log("Validating password...");
            const isPasswordMatch = await bcryptjs_1.default.compare(validated.password, userExists.password);
            if (!isPasswordMatch) {
                console.log("Password mismatch for email:", email);
                return res.status(400).json({
                    message: "Email or password is incorrect",
                });
            }
            console.log("Generating token...");
            const token = (0, jwt_1.generateToken)({
                id: userExists.id,
                email: userExists.email,
                role: userExists.role,
            });
            console.log("Login successful!");
            res.status(200).json({
                message: "Login success",
                data: token,
            });
        }
        catch (error) {
            console.log("Login error:", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            else {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async me(req, res) {
        const user = req.user;
        try {
            const userExists = await prisma_1.prisma.user.findFirst({
                where: {
                    email: user?.email,
                },
                include: {
                    Seller: {
                        select: {
                            id: true,
                            storeName: true,
                            storePhoto: true,
                            storeLocation: true,
                            verified: true,
                            bankName: true,
                            accountName: true,
                            accountNumber: true,
                            description: true,
                            wallet: true,
                        },
                    },
                },
            });
            if (!userExists) {
                return res.status(400).json({
                    message: "User not match in our record",
                });
            }
            return res.status(200).json({
                message: "Success get user detail",
                data: {
                    ...userExists,
                    password: undefined,
                },
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async update(req, res) {
        const { name, email, phone, address, username, gender, birthDate, photo } = req.body;
        const user = req?.user;
        try {
            const validated = auth_schema_1.updateSchema.parse({
                name,
                username,
                email,
                phone,
                address,
                gender,
                birthDate,
                photo,
            });
            const userExists = await prisma_1.prisma.user.findUnique({
                where: {
                    id: user?.id,
                },
            });
            if (!userExists) {
                return res.status(400).json({
                    message: "User not match in our record",
                });
            }
            const updatedUser = await prisma_1.prisma.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    name: validated.name,
                    username: validated.username,
                    email: validated.email,
                    phone: validated.phone,
                    address: validated.address,
                    gender: validated.gender,
                    birthDate: validated.birthDate,
                    photo: validated.photo,
                },
            });
            delete updatedUser.password;
            return res.status(200).json({
                message: "User updated successfully",
                data: updatedUser,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            else {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    // login admin
    async loginAdmin(req, res) {
        const { email, password } = req.body;
        try {
            const validated = auth_schema_1.loginSchema.parse({
                email,
                password,
            });
            const userExists = await prisma_1.prisma.user.findFirst({
                where: {
                    email: validated.email,
                    OR: [
                        {
                            role: "admin",
                        },
                        {
                            role: "superadmin",
                        },
                    ],
                },
            });
            if (!userExists) {
                return res.status(400).json({
                    message: "User not match in our record",
                });
            }
            const isPasswordMatch = await bcryptjs_1.default.compare(validated.password, userExists.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    message: "Email or password is incorrect",
                });
            }
            const token = (0, jwt_1.generateToken)({
                id: userExists.id,
                email: userExists.email,
                role: userExists.role,
            });
            res.status(200).json({
                message: "Login success",
                data: token,
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            else {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    // change password
    async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        const user = req?.user;
        try {
            const validated = auth_schema_1.changePasswordSchema.parse({
                oldPassword,
                newPassword,
            });
            const userExists = await prisma_1.prisma.user.findUnique({
                where: {
                    id: user?.id,
                },
            });
            if (!userExists) {
                return res.status(400).json({
                    message: "User not match in our record",
                });
            }
            const isPasswordMatch = await bcryptjs_1.default.compare(validated.oldPassword, userExists.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    message: "Password lama Anda tidak sesuai",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(validated.newPassword, 10);
            await prisma_1.prisma.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    password: hashedPassword,
                },
            });
            res.status(200).json({
                message: "Password updated successfully",
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            else {
                return res.status(500).json({
                    message: "Internal server error",
                });
            }
        }
    },
    async activation(req, res) {
        const { code } = req.body;
        try {
            const user = await prisma_1.prisma.user.update({
                where: {
                    activationCode: code,
                },
                data: {
                    isActive: true,
                },
            });
            return res.status(200).json({
                message: "User activated successfully",
                data: {
                    ...user,
                    password: undefined,
                },
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async updatePhoto(req, res) {
        const { photo } = req.body;
        try {
            const oldUser = await prisma_1.prisma.user.findUnique({
                where: {
                    id: req.user?.id,
                },
            });
            if (oldUser?.photo) {
                await (0, cloudinary_1.deleteImage)(oldUser?.photo);
            }
            const user = await prisma_1.prisma.user.update({
                where: {
                    id: req.user?.id,
                },
                data: {
                    photo,
                },
            });
            return res.status(200).json({
                message: "User photo updated successfully",
                data: {
                    ...user,
                    password: undefined,
                },
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    },
};
