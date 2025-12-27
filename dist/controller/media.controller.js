"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("../utils/cloudinary");
exports.default = {
    async upload(req, res) {
        if (!req.file) {
            return res.status(400).json({
                message: "File is not exist",
                data: null,
            });
        }
        try {
            console.log("File received:", req.file);
            const result = await (0, cloudinary_1.uploadImage)(req.file);
            res.status(200).json({
                message: "Success upload image",
                data: result,
            });
        }
        catch (error) {
            console.log("Upload error => ", error);
            res.status(500).json({
                message: "Internal server error during upload",
                error: error instanceof Error ? error.message : "Unknown error",
                data: null,
            });
        }
    },
    async delete(req, res) {
        try {
            const { fileUrl } = req.body;
            const result = await (0, cloudinary_1.deleteImage)(fileUrl);
            res.status(200).json({
                message: "Success delete image",
                data: result,
            });
        }
        catch (error) {
            console.log("error => ", error);
            res.status(500).json({
                message: "Internal server error",
                data: null,
            });
        }
    },
};
