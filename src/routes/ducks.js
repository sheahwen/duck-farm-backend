const express = require("express");
const router = express.Router();
const Duck = require("../models/Duck");
const User = require("../models/User");
const { validate, duckValidationRules } = require("../middleware/validators");

// Create a new duck
router.post("/", duckValidationRules, validate, async (req, res) => {
  try {
    const duck = new Duck({
      name: req.body.name,
      description: req.body.description,
      created_by: req.body.created_by,
      user_id: req.body.user_id,
    });

    const savedDuck = await duck.save();
    res.status(201).json(savedDuck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all ducks
router.get("/", async (req, res) => {
  try {
    const ducks = await Duck.find();
    res.json(ducks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all ducks for a specific user
router.get(
  "/user/:userId",
  [param("userId").isMongoId().withMessage("Invalid user ID format")],
  validate,
  async (req, res) => {
    try {
      // First check if the user exists
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user exists, then find their ducks
      const ducks = await Duck.find({ user_id: req.params.userId }).populate(
        "user_id",
        "name email"
      );

      res.json(ducks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
