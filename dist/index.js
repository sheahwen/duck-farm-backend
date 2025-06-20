"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
const ducks_1 = __importDefault(require("./routes/ducks"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const logger_1 = require("./middleware/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(logger_1.requestLogger);
// Skip express.json() for webhooks
app.use("/api/webhooks", webhooks_1.default);
app.use(express_1.default.json());
// Routes
app.use("/api/users", users_1.default);
app.use("/api/ducks", ducks_1.default);
app.get("/", (_, res) => {
    res.send("Hello World");
});
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error("MONGODB_URI is missing");
            return;
        }
        console.log("Attempting to connect to MongoDB...");
        await mongoose_1.default.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
};
connectDB();
// Add a health check endpoint to test MongoDB connection
app.get("/health", async (_, res) => {
    try {
        const dbState = mongoose_1.default.connection.readyState;
        const states = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };
        res.json({
            status: "ok",
            mongodb: states[dbState],
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Health check failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// Start server
const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
