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
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
// Skip express.json() for webhooks
app.use("/api/webhooks", webhooks_1.default);
app.use(express_1.default.json());
// Routes
app.use("/api/users", users_1.default);
app.use("/api/ducks", ducks_1.default);
app.get("/", (_, res) => {
    res.send("Hello World");
});
// MongoDB Connection
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
exports.default = app;
// Start server
if (process.env.ENVIRONMENT === "local") {
    const PORT = parseInt(process.env.PORT || "3000", 10);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
