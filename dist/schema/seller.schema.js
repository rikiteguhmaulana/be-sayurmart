"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerSchema = void 0;
const zod_1 = require("zod");
exports.sellerSchema = zod_1.z.object({
    storeName: zod_1.z.string().min(3, "Store name must be at least 3 characters"),
    description: zod_1.z.string().optional(),
    storeLocation: zod_1.z
        .string()
        .min(3, "Store location must be at least 3 characters"),
    bankName: zod_1.z.string().nonempty({ message: "Bank name is required" }),
    accountName: zod_1.z.string().nonempty({ message: "Account name is required" }),
    accountNumber: zod_1.z.string().nonempty({ message: "Account number is required" }),
});
