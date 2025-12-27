"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = exports.Payout = exports.Invoice = void 0;
const xendit_node_1 = __importDefault(require("xendit-node"));
const env_1 = __importDefault(require("./env"));
const x = new xendit_node_1.default({
    secretKey: env_1.default.XENDIT_SECRET_API_KEY,
});
exports.Invoice = x.Invoice;
exports.Payout = x.Payout;
exports.Balance = x.Balance;
