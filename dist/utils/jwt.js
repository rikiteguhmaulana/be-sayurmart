"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("./env"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign(user, env_1.default.JWT_SECRET, {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
const getUser = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET);
};
exports.getUser = getUser;
