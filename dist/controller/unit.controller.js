"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unit_schema_1 = require("../schema/unit.schema");
const prisma_1 = require("../utils/prisma");
const zod_1 = require("zod");
exports.default = {
    async create(req, res) {
        const { name, symbol } = req.body;
        try {
            const validated = unit_schema_1.unitSchema.parse({
                name,
                symbol,
            });
            const unitExists = await prisma_1.prisma.unit.findFirst({
                where: {
                    name: validated.name,
                },
            });
            if (unitExists) {
                return res.status(400).json({
                    message: "Unit already exists",
                });
            }
            const unit = await prisma_1.prisma.unit.create({
                data: {
                    name: validated.name,
                    symbol: validated.symbol,
                },
            });
            res.status(201).json({
                message: "Unit created successfully",
                data: unit,
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async index(req, res) {
        const { search } = req.query;
        try {
            const units = await prisma_1.prisma.unit.findMany({
                orderBy: {
                    createdAt: "desc",
                },
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
            res.status(200).json({
                message: "Units fetched successfully",
                data: units,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async update(req, res) {
        const { name, symbol } = req.body;
        const { id } = req.params;
        try {
            const validated = unit_schema_1.unitSchema.parse({ name, symbol });
            const unitExists = await prisma_1.prisma.unit.findFirst({
                where: {
                    name: validated.name,
                    NOT: { id },
                },
            });
            if (unitExists) {
                return res.status(400).json({
                    message: "Unit name already exists",
                });
            }
            const unit = await prisma_1.prisma.unit.update({
                where: { id },
                data: {
                    name: validated.name,
                    symbol: validated.symbol,
                },
            });
            res.status(200).json({
                message: "Unit updated successfully",
                data: unit,
            });
        }
        catch (error) {
            console.log(error);
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                });
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    },
    async destroy(req, res) {
        const { id } = req.params;
        try {
            const unit = await prisma_1.prisma.unit.delete({
                where: {
                    id,
                },
            });
            res.status(200).json({
                message: "Unit deleted successfully",
                data: unit,
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
            const unit = await prisma_1.prisma.unit.findUnique({
                where: {
                    id,
                },
            });
            res.status(200).json({
                message: "Unit fetched successfully",
                data: unit,
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
