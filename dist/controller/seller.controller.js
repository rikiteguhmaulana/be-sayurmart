"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma");
const seller_schema_1 = require("../schema/seller.schema");
exports.default = {
    async create(req, res) {
        const { storeName, storeLocation, description, bankName, accountName, accountNumber, } = req.body;
        try {
            const validated = seller_schema_1.sellerSchema.parse({
                storeName,
                storeLocation,
                description,
                bankName,
                accountName,
                accountNumber,
            });
            const sellerExists = await prisma_1.prisma.seller.findFirst({
                where: {
                    OR: [
                        {
                            userId: req.user?.id,
                        },
                        {
                            storeName: validated.storeName,
                        },
                    ],
                },
            });
            if (sellerExists) {
                return res.status(400).json({
                    message: "Store or seller already exists",
                });
            }
            const seller = await prisma_1.prisma.seller.create({
                data: {
                    userId: req.user?.id,
                    storeName: validated.storeName,
                    storeLocation: validated.storeLocation,
                    description: validated.description || "",
                    bankName: validated.bankName,
                    accountName: validated.accountName,
                    accountNumber: validated.accountNumber,
                },
            });
            res.status(201).json({
                message: "Store or seller created successfully",
                data: seller,
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
                    data: null,
                });
            }
        }
    },
    async index(req, res) {
        const { search, page, limit } = req.query;
        try {
            const sellers = await prisma_1.prisma.seller.findMany({
                include: {
                    products: {
                        include: {
                            Unit: true,
                            category: true,
                        },
                    },
                    user: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                ...(search
                    ? {
                        where: {
                            OR: [
                                {
                                    storeName: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    user: {
                                        name: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                                {
                                    storeLocation: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        },
                    }
                    : {}),
                ...(limit ? { take: Number(limit) } : {}),
                ...(page ? { skip: (Number(page) - 1) * Number(limit) } : {}),
            });
            const total = await prisma_1.prisma.seller.count({
                ...(search
                    ? {
                        where: {
                            OR: [
                                {
                                    storeName: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                                {
                                    user: {
                                        name: {
                                            contains: search,
                                            mode: "insensitive",
                                        },
                                    },
                                },
                                {
                                    storeLocation: {
                                        contains: search,
                                        mode: "insensitive",
                                    },
                                },
                            ],
                        },
                    }
                    : {}),
            });
            res.status(200).json({
                message: "Sellers fetched successfully",
                data: {
                    sellers,
                    totalPage: Math.ceil(total / Number(limit)),
                    currentPage: Number(page),
                    total,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
    async show(req, res) {
        const { id } = req.params;
        try {
            const seller = await prisma_1.prisma.seller.findUnique({
                where: {
                    id,
                },
                include: {
                    products: {
                        include: {
                            Unit: true,
                            category: true,
                        },
                    },
                    user: true,
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not found",
                });
            }
            res.status(200).json({
                message: "Seller fetched successfully",
                data: seller,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
    async me(req, res) {
        const { limit, page, search } = req.query;
        const user = req.user;
        try {
            const seller = await prisma_1.prisma.seller.findFirst({
                where: {
                    userId: user?.id,
                },
                include: {
                    products: {
                        where: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        take: Number(limit),
                        skip: (Number(page) - 1) * Number(limit),
                        include: {
                            category: true,
                            Unit: true,
                        },
                        orderBy: {
                            updatedAt: "desc",
                        },
                    },
                    user: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            address: true,
                        },
                    },
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not found",
                    data: null,
                });
            }
            const total = await prisma_1.prisma.product.count({
                where: {
                    sellerId: seller.id,
                },
            });
            res.status(200).json({
                message: "Seller fetched successfully",
                data: {
                    seller,
                    totalPage: Math.ceil(total / Number(limit)),
                    currentPage: Number(page),
                    total,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
    async update(req, res) {
        const user = req.user;
        const { storeName, storeLocation, description, bankName, accountName, accountNumber, } = req.body;
        try {
            const validated = seller_schema_1.sellerSchema.parse({
                storeName,
                storeLocation,
                description,
                bankName,
                accountName,
                accountNumber,
            });
            const sellerExists = await prisma_1.prisma.seller.findFirst({
                where: {
                    userId: user?.id,
                },
            });
            if (!sellerExists) {
                return res.status(404).json({
                    message: "Seller not found",
                });
            }
            const seller = await prisma_1.prisma.seller.update({
                where: {
                    id: sellerExists.id,
                },
                data: {
                    storeName: validated.storeName,
                    storeLocation: validated.storeLocation,
                    description: validated.description,
                    bankName: validated.bankName,
                    accountName: validated.accountName,
                    accountNumber: validated.accountNumber,
                },
            });
            res.status(200).json({
                message: "Seller updated successfully",
                data: seller,
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
                    data: null,
                });
            }
        }
    },
    async delete(req, res) {
        const user = req.user;
        const deleteConfirmation = req.body;
        try {
            const sellerExists = await prisma_1.prisma.seller.findFirst({
                where: {
                    userId: user?.id,
                },
            });
            if (!sellerExists) {
                return res.status(404).json({
                    message: "Seller not found",
                });
            }
            if (sellerExists.storeName !== deleteConfirmation.storeName) {
                return res.status(400).json({
                    message: "Store name does not match",
                });
            }
            const seller = await prisma_1.prisma.seller.delete({
                where: {
                    id: sellerExists.id,
                },
            });
            res.status(200).json({
                message: "Seller deleted successfully",
                data: seller,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
    async adminDeleteSeller(req, res) {
        const { id } = req.params;
        try {
            const seller = await prisma_1.prisma.seller.delete({
                where: {
                    id: id,
                },
            });
            res.status(200).json({
                message: "Seller deleted successfully",
                data: seller,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
    async verifySeller(req, res) {
        const { id } = req.params;
        try {
            const seller = await prisma_1.prisma.seller.findUnique({
                where: {
                    id: id,
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not found",
                });
            }
            const updatedSeller = await prisma_1.prisma.seller.update({
                where: {
                    id: id,
                },
                data: {
                    verified: true,
                },
            });
            res.status(200).json({
                message: "Seller verified successfully",
                data: updatedSeller,
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
};
