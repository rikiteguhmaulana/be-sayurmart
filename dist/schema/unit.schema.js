"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitSchema = void 0;
const zod_1 = require("zod");
exports.unitSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty("Please input unit name"),
    symbol: zod_1.z.string().nonempty("Please input unit symbol"),
});
