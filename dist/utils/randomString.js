"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = void 0;
function generateOrderId(prefix) {
    const now = new Date();
    const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("");
    // random 5 digit alfanumerik
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}${date}${random}`;
}
exports.generateOrderId = generateOrderId;
