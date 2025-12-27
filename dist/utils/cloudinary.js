"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
cloudinary_1.v2.config({
    cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.default.CLOUDINARY_API_KEY,
    api_secret: env_1.default.CLOUDINARY_API_SECRET,
});
const toDataUrl = (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataUrl = `data:${file.mimetype};base64,${b64}`;
    return dataUrl;
};
const getPublicUrl = (fileUrl) => {
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const publicId = fileName.substring(0, fileName.lastIndexOf("."));
    return publicId;
};
const uploadImage = async (file) => {
    const dataUrl = toDataUrl(file);
    const result = await cloudinary_1.v2.uploader.upload(dataUrl, {
        resource_type: "auto",
        folder: "sayur-segar",
    });
    return result;
};
exports.uploadImage = uploadImage;
const deleteImage = async (fileUrl) => {
    const publicId = getPublicUrl(fileUrl);
    const result = await cloudinary_1.v2.uploader.destroy(`sayur-segar/${publicId}`);
    return result;
};
exports.deleteImage = deleteImage;
