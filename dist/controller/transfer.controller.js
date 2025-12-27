"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xendit_1 = require("../utils/xendit");
const prisma_1 = require("../utils/prisma");
const client_1 = require("@prisma/client");
exports.default = {
    async create(req, res) {
        try {
            const { amount, accountNumber, accountHolderName, channelCode, referenceId, } = req.body;
            const payoutRes = await xendit_1.Payout.createPayout({
                data: {
                    referenceId,
                    channelCode,
                    channelProperties: {
                        accountNumber,
                        accountHolderName,
                    },
                    amount,
                    currency: "IDR",
                    description: "Transfer payout",
                },
                idempotencyKey: `payout-${Date.now()}`,
            });
            res.status(200).json({
                message: "Success",
                data: payoutRes,
            });
        }
        catch (error) {
            console.error("Error creating payout:", error);
            return res.status(500).json({ message: error.message });
        }
    },
    async payoutWebhook(req, res) {
        const event = req.body;
        try {
            const referenceId = event?.data?.reference_id;
            // TODO: update database sesuai referenceId
            await prisma_1.prisma.walletTransaction.update({
                where: {
                    id: referenceId,
                },
                data: {
                    status: client_1.WalletTransactionStatus.success,
                },
            });
            res.status(200).json({ received: true });
        }
        catch (err) {
            console.error("Error handling webhook:", err.message);
            res.status(500).json({ message: "Webhook error" });
        }
    },
};
