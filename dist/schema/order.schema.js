"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutSchema = exports.orderSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().nonempty({ message: "Product ID is required" }),
    quantity: zod_1.z.number().min(1, { message: "Quantity must be at least 1" }),
    price: zod_1.z.number().min(0, { message: "Price must be >= 0" }),
});
exports.orderSchema = zod_1.z.object({
    userId: zod_1.z.string().nonempty({ message: "User ID is required" }),
    sellerId: zod_1.z.string().nonempty({ message: "Seller ID is required" }),
    address: zod_1.z.string().nonempty({ message: "Address is required" }),
    shippingFee: zod_1.z.number().min(0, { message: "Shipping fee must be >= 0" }),
    totalPrice: zod_1.z.number().min(0, { message: "Total price must be >= 0" }),
    status: zod_1.z
        .enum(["PENDING", "PAID", "FAILED", "PROCESSING", "DELIVERED", "COMPLETED"])
        .default("PENDING"),
    items: zod_1.z
        .array(exports.orderItemSchema)
        .nonempty({ message: "Order must have at least 1 item" }),
    paymentUrl: zod_1.z.string().nullable().optional(),
});
// khusus checkout (user kirim address dan sellerPaymentMethodId)
exports.checkoutSchema = zod_1.z.object({
    address: zod_1.z.string().nonempty({ message: "Address is required" }),
});
