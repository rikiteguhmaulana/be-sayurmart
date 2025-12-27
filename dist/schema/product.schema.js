"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty({ message: "Please input product name" }),
    description: zod_1.z.string().nonempty({ message: "Please input description" }),
    price: zod_1.z.number().nonnegative(),
    stock: zod_1.z.number().min(1).nonnegative(),
    imageUrl: zod_1.z.string().nonempty(),
    categoryId: zod_1.z.string().nonempty({ message: "Please input category" }),
    unitId: zod_1.z.string().nonempty({ message: "Please input unit" }),
});
