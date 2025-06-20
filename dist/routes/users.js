"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const validators_1 = require("../middleware/validators");
const router = express_1.default.Router();
// Create a new user
router.post("/", validators_1.userValidationRules, validators_1.validate, async (req, res) => {
    try {
        const user = new User_1.default({
            name: req.body.name,
            email: req.body.email,
            created_by: req.body.created_by,
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// TO REMOVE
router.get("/", async (req, res) => {
    try {
        const users = await User_1.default.find();
        res.status(201).json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// TO REMOVE
router.delete("/:id", async (req, res) => {
    try {
        const result = await User_1.default.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "User deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = router;
