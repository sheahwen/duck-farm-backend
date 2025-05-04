import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users";
import duckRoutes from "./routes/ducks";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/ducks", duckRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: Error) => console.error("MongoDB connection error:", error));

// Start server
const PORT: number = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
