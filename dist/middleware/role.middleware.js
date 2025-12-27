"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(roles) {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                message: "Forbidden",
                data: null,
            });
        }
        next();
    };
}
exports.default = default_1;
