"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Duck_1 = __importDefault(require("../models/Duck"));
const User_1 = __importDefault(require("../models/User"));
const validators_1 = require("../middleware/validators");
const storage_1 = require("../services/storage");
const router = express_1.default.Router();
// Create a new duck
router.post("/", validators_1.duckValidationRules, validators_1.validate, async (req, res) => {
    console.log("Creating duck");
    try {
        const user = await User_1.default.findOne({ auth_id: req.body.user_id });
        console.log("User found", user);
        if (!user) {
            console.log("User not found");
            console.error("User not found");
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Upload image to Google Cloud Storage
        console.log("Uploading image to Google Cloud Storage");
        const uploadedImageUrl = await (0, storage_1.uploadImageFromUrl)(req.body.image_url);
        console.log("Image uploaded to Google Cloud Storage", uploadedImageUrl);
        const duck = new Duck_1.default({
            name: req.body.name,
            description: req.body.description,
            created_by: req.body.created_by,
            user_id: user.id,
            image_url: uploadedImageUrl,
        });
        console.log("duck created", duck);
        const savedDuck = await duck.save();
        res.status(201).json(savedDuck);
    }
    catch (error) {
        console.error("Error creating duck:", error);
        res.status(400).json({ message: error.message });
    }
});
// Get all ducks
router.get("/", async (req, res) => {
    try {
        const ducks = await Duck_1.default.find().limit(10);
        res.json(ducks);
    }
    catch (error) {
        console.error("Error getting ducks:", error);
        res.status(500).json({ message: error.message });
    }
});
// Get all ducks for a specific user
router.get("/user/:userId", [(0, express_validator_1.param)("userId").isMongoId().withMessage("Invalid user ID format")], validators_1.validate, async (req, res) => {
    try {
        // First check if the user exists
        const user = await User_1.default.findById(req.params.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // If user exists, then find their ducks
        const ducks = await Duck_1.default.find({ user_id: req.params.userId }).populate("user_id", "name email");
        res.json(ducks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
