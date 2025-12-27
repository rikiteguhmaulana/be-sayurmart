"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
exports.default = {
    async index(req, res) {
        const { search, page, limit } = req.query;
        try {
            const users = await prisma_1.prisma.user.findMany({
                where: {
                    ...(search
                        ? {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }
                        : {}),
                },
                orderBy: {
                    createdAt: "desc",
                },
                ...(limit ? { take: Number(limit) } : {}),
                ...(page ? { skip: (Number(page) - 1) * Number(limit) } : {}),
            });
            const total = await prisma_1.prisma.user.count({
                where: {
                    ...(search
                        ? {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }
                        : {}),
                },
            });
            return res.status(200).json({
                message: "Users fetched successfully",
                data: {
                    users,
                    totalPage: Math.ceil(total / Number(limit)),
                    currentPage: Number(page),
                    total,
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
    async show(req, res) {
        const { id } = req.params;
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            res.status(200).json({
                message: "User fetched successfully",
                data: user,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async destroy(req, res) {
        const { id } = req.params;
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: {
                    id,
                },
            });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            await prisma_1.prisma.user.delete({
                where: {
                    id,
                },
            });
            res.status(200).json({
                message: "User deleted successfully",
                data: user,
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
