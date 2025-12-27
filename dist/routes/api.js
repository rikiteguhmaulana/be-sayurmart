"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const seller_controller_1 = __importDefault(require("../controller/seller.controller"));
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const media_middleware_1 = require("../middleware/media.middleware");
const media_controller_1 = __importDefault(require("../controller/media.controller"));
const category_controller_1 = __importDefault(require("../controller/category.controller"));
const role_middleware_1 = __importDefault(require("../middleware/role.middleware"));
const cart_controller_1 = __importDefault(require("../controller/cart.controller"));
const order_controller_1 = __importDefault(require("../controller/order.controller"));
const wallet_controller_1 = __importDefault(require("../controller/wallet.controller"));
const wallet_transaction_controller_1 = __importDefault(require("../controller/wallet-transaction.controller"));
const transfer_controller_1 = __importDefault(require("../controller/transfer.controller"));
const unit_controller_1 = __importDefault(require("../controller/unit.controller"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const router = express_1.default.Router();
// Auth
router.post("/auth/register", auth_controller_1.default.register);
router.post("/auth/login", auth_controller_1.default.login);
router.post("/auth/login-admin", auth_controller_1.default.loginAdmin);
router.get("/auth/me", auth_middleware_1.default, auth_controller_1.default.me);
router.put("/auth/update", auth_middleware_1.default, auth_controller_1.default.update);
router.put("/auth/update-photo", auth_middleware_1.default, auth_controller_1.default.updatePhoto);
router.put("/auth/change-password", auth_middleware_1.default, auth_controller_1.default.changePassword);
router.post("/auth/activation", auth_controller_1.default.activation);
// User
router.get("/users", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], user_controller_1.default.index);
router.get("/users/:id", user_controller_1.default.show);
router.delete("/users/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], user_controller_1.default.destroy);
// Seller
router.post("/seller", auth_middleware_1.default, seller_controller_1.default.create);
router.get("/seller", seller_controller_1.default.index);
router.get("/seller/me", auth_middleware_1.default, seller_controller_1.default.me);
router.put("/seller", auth_middleware_1.default, seller_controller_1.default.update);
router.get("/seller/:id", seller_controller_1.default.show);
router.delete("/seller", auth_middleware_1.default, seller_controller_1.default.delete);
router.delete("/seller/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], seller_controller_1.default.adminDeleteSeller);
router.put("/seller/verify/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], seller_controller_1.default.verifySeller);
// Product
router.post("/product", auth_middleware_1.default, product_controller_1.default.create);
router.get("/product", product_controller_1.default.index);
router.get("/product/featured", product_controller_1.default.getFeatured);
router.get("/product/:id", product_controller_1.default.show);
router.put("/product/:id", auth_middleware_1.default, product_controller_1.default.update);
router.delete("/product/:id", auth_middleware_1.default, product_controller_1.default.delete);
router.delete("/product/admin/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], product_controller_1.default.adminDelete);
// Media
router.post("/media/upload", [auth_middleware_1.default, (0, media_middleware_1.uploadSingle)("image")], media_controller_1.default.upload);
router.delete("/media/delete", auth_middleware_1.default, media_controller_1.default.delete);
// Category
router.post("/category", [auth_middleware_1.default, (0, role_middleware_1.default)(["admin", "superadmin"])], category_controller_1.default.create);
router.get("/category", category_controller_1.default.index);
router.get("/category/:id", category_controller_1.default.show);
router.put("/category/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["admin", "superadmin"])], category_controller_1.default.update);
router.delete("/category/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["admin", "superadmin"])], category_controller_1.default.delete);
// Cart
router.post("/cart", auth_middleware_1.default, cart_controller_1.default.create);
router.get("/cart", auth_middleware_1.default, cart_controller_1.default.index);
router.delete("/cart", auth_middleware_1.default, cart_controller_1.default.destroy);
router.put("/cart/increase", auth_middleware_1.default, cart_controller_1.default.increase);
router.put("/cart/decrease", auth_middleware_1.default, cart_controller_1.default.decrease);
// Order
router.post("/order", auth_middleware_1.default, order_controller_1.default.create);
router.post("/order/webhook", order_controller_1.default.webhook);
router.get("/order", auth_middleware_1.default, order_controller_1.default.index);
router.get("/order/seller", auth_middleware_1.default, order_controller_1.default.sellerIndex);
router.get("/order/user", auth_middleware_1.default, order_controller_1.default.userIndex);
router.get("/order/:id", auth_middleware_1.default, order_controller_1.default.show);
router.get("/order/invoice/:id", auth_middleware_1.default, order_controller_1.default.showByInvoiceId);
router.put("/order/process/:id", auth_middleware_1.default, order_controller_1.default.isProcess);
router.put("/order/delivered/:id", auth_middleware_1.default, order_controller_1.default.isDelivered);
router.put("/order/completed/:id", auth_middleware_1.default, order_controller_1.default.isCompleted);
// Wallet
router.post("/wallet", auth_middleware_1.default, wallet_controller_1.default.create);
router.get("/wallet/balance", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], wallet_controller_1.default.index);
// Wallet Transaction
router.get("/wallet/transaction/superadmin", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], wallet_transaction_controller_1.default.superAdminIndex);
router.get("/wallet/transaction", auth_middleware_1.default, wallet_transaction_controller_1.default.index);
router.post("/wallet/transaction", auth_middleware_1.default, wallet_transaction_controller_1.default.create);
router.get("/wallet/transaction/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], wallet_transaction_controller_1.default.show);
router.delete("/wallet/transaction/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], wallet_transaction_controller_1.default.destroy);
// Payout
router.post("/transfer", [auth_middleware_1.default, (0, role_middleware_1.default)(["superadmin"])], transfer_controller_1.default.create);
router.post("/transfer/webhook", transfer_controller_1.default.payoutWebhook);
// Unit
router.post("/unit", [auth_middleware_1.default, (0, role_middleware_1.default)(["admin", "superadmin"])], unit_controller_1.default.create);
router.get("/unit", unit_controller_1.default.index);
router.put("/unit/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["admin", "superadmin"])], unit_controller_1.default.update);
router.delete("/unit/:id", [auth_middleware_1.default, (0, role_middleware_1.default)(["admin", "superadmin"])], unit_controller_1.default.destroy);
router.get("/unit/:id", unit_controller_1.default.show);
exports.default = router;
