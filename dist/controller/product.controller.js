"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const product_schema_1 = require("../schema/product.schema");
const zod_1 = require("zod");
exports.default = {
    async create(req, res) {
        const user = req.user;
        const { name, description, price, stock, imageUrl, categoryId, unitId } = req.body;
        try {
            const validated = product_schema_1.productSchema.parse({
                name,
                description,
                price,
                stock,
                imageUrl,
                categoryId,
                unitId,
            });
            const seller = await prisma_1.prisma.seller.findFirst({
                where: {
                    AND: [
                        {
                            userId: user?.id,
                        },
                        {
                            verified: true,
                        },
                    ],
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not match in our record or make sure you are verified",
                });
            }
            const product = await prisma_1.prisma.product.create({
                data: {
                    sellerId: seller?.id,
                    name: validated.name,
                    description: validated.description,
                    price: Number(validated.price),
                    stock: validated.stock,
                    imageUrl: validated.imageUrl,
                    categoryId: validated.categoryId,
                    unitId: validated.unitId,
                },
            });
            res.status(201).json({
                message: "Product created successfully",
                data: {
                    ...product,
                    price: Number(product.price),
                },
            });
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            console.log("error => ", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async index(req, res) {
        const { search, category, page, limit } = req.query;
        try {
            const products = await prisma_1.prisma.product.findMany({
                where: {
                    ...(search
                        ? {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }
                        : {}),
                    ...(category ? { categoryId: category } : {}),
                },
                include: {
                    seller: {
                        select: {
                            storeName: true,
                            storeLocation: true,
                        },
                    },
                    category: true,
                    Unit: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
            });
            const total = await prisma_1.prisma.product.count({
                where: {
                    ...(search
                        ? {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        }
                        : {}),
                    ...(category ? { categoryId: category } : {}),
                },
            });
            res.status(200).json({
                message: "Products fetched successfully",
                data: {
                    products,
                    totalPage: Math.ceil(total / Number(limit)),
                    currentPage: Number(page),
                    total,
                },
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async show(req, res) {
        const { id } = req.params;
        try {
            const product = await prisma_1.prisma.product.findUnique({
                where: {
                    id,
                },
                include: {
                    seller: {
                        select: {
                            storeName: true,
                            storeLocation: true,
                            userId: true,
                        },
                    },
                    category: true,
                    Unit: true,
                },
            });
            if (!product) {
                return res.status(404).json({
                    message: "Product not match in our record",
                });
            }
            res.status(200).json({
                message: "Product fetched successfully",
                data: {
                    ...product,
                    price: Number(product.price),
                },
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async update(req, res) {
        const user = req.user;
        const { id } = req.params;
        const { name, description, price, stock, imageUrl, categoryId, unitId } = req.body;
        try {
            const validated = product_schema_1.productSchema.parse({
                name,
                description,
                price,
                stock,
                imageUrl,
                categoryId,
                unitId,
            });
            const seller = await prisma_1.prisma.seller.findFirst({
                where: {
                    userId: user?.id,
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not match in our record",
                });
            }
            const product = await prisma_1.prisma.product.findUnique({
                where: {
                    id,
                },
                include: {
                    seller: {},
                },
            });
            if (!product) {
                return res.status(404).json({
                    message: "Product not match in our record",
                });
            }
            if (product.sellerId !== seller?.id) {
                return res.status(403).json({
                    message: "You are not authorized to update this product",
                });
            }
            const updatedProduct = await prisma_1.prisma.product.update({
                where: {
                    id,
                },
                data: {
                    name: validated.name,
                    description: validated.description,
                    price: Number(validated.price),
                    stock: validated.stock,
                    imageUrl: validated.imageUrl,
                    categoryId: validated.categoryId,
                    unitId: validated.unitId,
                },
            });
            res.status(200).json({
                message: "Product updated successfully",
                data: {
                    ...updatedProduct,
                    price: Number(updatedProduct.price),
                },
            });
        }
        catch (error) {
            console.log("error => ", error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            console.log("error => ", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async delete(req, res) {
        const user = req.user;
        const { id } = req.params;
        try {
            const seller = await prisma_1.prisma.seller.findFirst({
                where: {
                    userId: user?.id,
                },
            });
            if (!seller) {
                return res.status(404).json({
                    message: "Seller not match in our record",
                });
            }
            const product = await prisma_1.prisma.product.findUnique({
                where: {
                    id,
                },
            });
            if (product?.sellerId !== seller?.id) {
                return res.status(403).json({
                    message: "You are not authorized to delete this product",
                });
            }
            if (!product) {
                return res.status(404).json({
                    message: "Product not match in our record",
                });
            }
            const deletedProduct = await prisma_1.prisma.product.delete({
                where: {
                    id,
                },
            });
            res.status(200).json({
                message: "Product deleted successfully",
                data: {
                    ...deletedProduct,
                    price: Number(deletedProduct.price),
                },
            });
        }
        catch (error) {
            console.log("error => ", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async adminDelete(req, res) {
        const { id } = req.params;
        try {
            const product = await prisma_1.prisma.product.findUnique({
                where: {
                    id,
                },
            });
            if (!product) {
                return res.status(404).json({
                    message: "Product not match in our record",
                });
            }
            const deletedProduct = await prisma_1.prisma.product.delete({
                where: {
                    id,
                },
            });
            res.status(200).json({
                message: "Product deleted successfully",
                data: {
                    ...deletedProduct,
                    price: Number(deletedProduct.price),
                },
            });
        }
        catch (error) {
            console.log("error => ", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async getFeatured(req, res) {
        try {
            const products = await prisma_1.prisma.product.findMany({
                include: {
                    seller: {
                        select: {
                            storeName: true,
                            storeLocation: true,
                        },
                    },
                    category: true,
                    Unit: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 8,
            });
            res.status(200).json({
                message: "Products fetched successfully",
                data: products,
            });
        }
        catch (error) {
            console.log("error => ", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    },
};
