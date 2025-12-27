"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
const xendit_1 = require("../utils/xendit");
exports.default = {
    async create(req, res) {
        const user = req?.user;
        try {
            const seller = await prisma_1.prisma.seller.findFirst({
                where: {
                    userId: user?.id,
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not found",
                });
            }
            const walletExists = await prisma_1.prisma.wallet.findFirst({
                where: {
                    sellerId: seller?.id,
                },
            });
            if (walletExists) {
                return res.status(400).json({
                    message: "Wallet already exists",
                });
            }
            const wallet = await prisma_1.prisma.wallet.create({
                data: {
                    sellerId: seller?.id,
                },
            });
            return res.status(201).json({
                message: "Wallet created successfully",
                data: wallet,
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                return res.status(400).json({
                    message: error.message,
                    code: error.code,
                    meta: error.meta,
                });
            }
            console.error("Wallet create error:", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async index(req, res) {
        try {
            const balance = await xendit_1.Balance.getBalance({
                currency: "IDR",
            });
            return res.status(200).json({
                message: "Balance fetched successfully",
                data: balance,
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
