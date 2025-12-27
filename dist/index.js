"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// 1. Logger di urutan paling atas untuk menangkap semua request
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[Incoming Request] ${req.method} ${req.url}`);
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
});
// 2. CORS yang lebih fleksibel namun aman (mendukung credentials)
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Izinkan semua origin untuk development agar request tidak terblokir
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
}));
// 3. Body parsers
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const PORT = 5000;
api_1.default.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API",
    });
});
app.use("/api", api_1.default);
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
exports.default = app;
