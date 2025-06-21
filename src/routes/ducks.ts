import express, { Request, Response, Router } from "express";
import { param } from "express-validator";
import Duck from "../models/Duck";
import User from "../models/User";
import { validate, duckValidationRules } from "../middleware/validators";
import { uploadImageFromUrl } from "../services/storage";

const router: Router = express.Router();

// Create a new duck
router.post(
  "/",
  duckValidationRules,
  validate,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ auth_id: req.body.user_id });
      if (!user) {
        console.error("User not found");
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Upload image to Google Cloud Storage
      const uploadedImageUrl = await uploadImageFromUrl(req.body.image_url);

      const duck = new Duck({
        name: req.body.name,
        description: req.body.description,
        created_by: req.body.created_by,
        user_id: user.id,
        image_url: uploadedImageUrl,
      });

      const savedDuck = await duck.save();
      res.status(201).json(savedDuck);
    } catch (error) {
      console.error("Error creating duck:", error);
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

// Get all ducks
router.get("/", async (req: Request, res: Response) => {
  try {
    const ducks = await Duck.aggregate([{ $sample: { size: 10 } }]);
    res.json(ducks);
  } catch (error) {
    console.error("Error getting ducks:", error);
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get all ducks for a specific user
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    // Find user by Clerk auth_id
    const user = await User.findOne({ auth_id: req.params.userId });
    if (!user) {
      console.error("user not found", req.params.userId);
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If user exists, then find their ducks
    const ducks = await Duck.find({ user_id: user._id }).populate(
      "user_id",
      "name email"
    );

    res.json(ducks);
  } catch (error) {
    console.error("Error getting ducks:", error);
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
