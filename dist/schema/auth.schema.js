"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(3, { message: "Name must be at least 3 characters" }),
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters" }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 characters" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: zod_1.z.string(),
    address: zod_1.z.string().nonempty({ message: "Address is required" }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
exports.updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, { message: "Name must be at least 3 characters" }),
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters" }),
    gender: zod_1.z.enum(["male", "female"]),
    birthDate: zod_1.z.string(),
    photo: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    phone: zod_1.z
        .string()
        .min(10, { message: "Phone number must be at least 10 characters" }),
    address: zod_1.z.string().nonempty({ message: "Address is required" }),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    newPassword: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
});
