import express, { Request, Response, Router } from "express";
import User from "../models/User";
import { validate, userValidationRules } from "../middleware/validators";

const router: Router = express.Router();

// Create a new user
router.post(
  "/",
  userValidationRules,
  validate,
  async (req: Request, res: Response) => {
    try {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        created_by: req.body.created_by,
      });

      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
);

// TO REMOVE
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// TO REMOVE
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
