const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validate, userValidationRules } = require("../middleware/validators");

// Create a new user
router.post("/", userValidationRules, validate, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      created_by: req.body.created_by,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// TO REMOVE
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// TO REMOVE
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
