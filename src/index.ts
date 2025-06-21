import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users";
import duckRoutes from "./routes/ducks";
import webhookRoutes from "./routes/webhooks";
import { requestLogger } from "./middleware/logger";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({ origin: "https://duck-farm-nextjs.vercel.app" }));
app.use(requestLogger);

// Skip express.json() for webhooks
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
// Routes
app.use("/api/users", userRoutes);
app.use("/api/ducks", duckRoutes);

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
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};
connectDB();

// Add a health check endpoint to test MongoDB connection
app.get("/health", async (_, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      status: "ok",
      mongodb: states[dbState as keyof typeof states],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
// Start server
const PORT: number = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
