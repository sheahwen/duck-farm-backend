import { verifyWebhook } from "@clerk/express/webhooks";
import express, { Request, Response, Router } from "express";
import { CLERK_WEBHOOK } from "../constants";
import User from "../models/User";

const router: Router = express.Router();

// Clerk webhook to sync users to the database
router.post(
  "/sync-users",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const event = await verifyWebhook(req);

      const { id } = event.data;
      const eventType = event.type;

      // Check if the event is a user created event
      if (eventType !== "user.created") {
        res.status(404).send(`Event type ${eventType} not supported`);
        return;
      }

      // Validate the event data
      if (
        !event.data.first_name ||
        !event.data.email_addresses[0].email_address ||
        !event.data.id
      ) {
        res.status(400).send("Missing required fields");
        return;
      }

      console.log(`Received webhook with ID ${id}`);

      // Handle indempotency
      const existingUser = await User.findOne({ auth_id: event.data.id });
      if (existingUser) {
        res.send("User already exists");
        return;
      }

      const user = await User.create({
        first_name: event.data.first_name,
        last_name: event.data.last_name,
        email: event.data.email_addresses?.[0]?.email_address,
        image_url: event.data.image_url,
        auth_id: event.data.id,
        provider: event.data.external_accounts?.[0]?.provider,
        created_by: CLERK_WEBHOOK,
      });

      const savedUser = await user.save();

      console.log(`User ${savedUser._id} created`);

      res.send("Webhook received");
      return;
    } catch (error) {
      console.error("Error creating user:", (error as Error).message);
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

export default router;
