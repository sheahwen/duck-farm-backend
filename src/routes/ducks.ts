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
    console.log("Creating duck");
    try {
      const user = await User.findOne({ auth_id: req.body.user_id });
      console.log("User found", user);
      if (!user) {
        console.log("User not found");
        console.error("User not found");
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Upload image to Google Cloud Storage
      console.log("Uploading image to Google Cloud Storage");
      const uploadedImageUrl = await uploadImageFromUrl(req.body.image_url);
      console.log("Image uploaded to Google Cloud Storage", uploadedImageUrl);

      const duck = new Duck({
        name: req.body.name,
        description: req.body.description,
        created_by: req.body.created_by,
        user_id: user.id,
        image_url: uploadedImageUrl,
      });
      console.log("duck created", duck);

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
    const ducks = await Duck.find();
    res.json(ducks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get all ducks for a specific user
router.get(
  "/user/:userId",
  [param("userId").isMongoId().withMessage("Invalid user ID format")],
  validate,
  async (req: Request, res: Response) => {
    try {
      // First check if the user exists
      const user = await User.findById(req.params.userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // If user exists, then find their ducks
      const ducks = await Duck.find({ user_id: req.params.userId }).populate(
        "user_id",
        "name email"
      );

      res.json(ducks);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
);

export default router;
