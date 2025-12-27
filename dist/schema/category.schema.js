"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().nonempty({ message: "Please input category name" }),
    imageUrl: zod_1.z.string().nonempty({ message: "Please input image url" }),
});
