import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./routes/users";
import duckRoutes from "./routes/ducks";
import webhookRoutes from "./routes/webhooks";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());

// Skip express.json() for webhooks
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
// Routes
app.use("/api/users", userRoutes);
app.use("/api/ducks", duckRoutes);

app.get("/", (_, res) => {
  res.send("Hello World");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: Error) => console.error("MongoDB connection error:", error));

export default app;

// Start server
if (process.env.ENVIRONMENT === "local") {
  const PORT: number = parseInt(process.env.PORT || "3000", 10);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
