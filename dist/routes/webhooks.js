"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webhooks_1 = require("@clerk/express/webhooks");
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Clerk webhook to sync users to the database
router.post("/sync-users", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const event = await (0, webhooks_1.verifyWebhook)(req);
        const { id } = event.data;
        const eventType = event.type;
        // Check if the event is a user created event
        if (eventType !== "user.created") {
            res.status(404).send(`Event type ${eventType} not supported`);
            return;
        }
        // Validate the event data
        if (!event.data.first_name ||
            !event.data.email_addresses[0].email_address ||
            !event.data.id) {
            res.status(400).send("Missing required fields");
            return;
        }
        console.log(`Received webhook with ID ${id}`);
        // Handle indempotency
        const existingUser = await User_1.default.findOne({ auth_id: event.data.id });
        if (existingUser) {
            res.send("User already exists");
            return;
        }
        const user = await User_1.default.create({
            first_name: event.data.first_name,
            last_name: event.data.last_name,
            email: (_b = (_a = event.data.email_addresses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.email_address,
            image_url: event.data.image_url,
            auth_id: event.data.id,
            provider: (_d = (_c = event.data.external_accounts) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.provider,
            created_by: constants_1.CLERK_WEBHOOK,
        });
        const savedUser = await user.save();
        console.log(`User ${savedUser._id} created`);
        res.send("Webhook received");
        return;
    }
    catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
