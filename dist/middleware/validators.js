"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duckValidationRules = exports.userValidationRules = exports.validate = void 0;
const express_validator_1 = require("express-validator");
// Validation middleware
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.error("validation error", JSON.stringify(errors.array()));
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validate = validate;
// User validation rules
const userValidationRules = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("created_by")
        .trim()
        .notEmpty()
        .withMessage("Created by is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Created by must be between 2 and 50 characters"),
];
exports.userValidationRules = userValidationRules;
// Duck validation rules
const duckValidationRules = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 2, max: 500 })
        .withMessage("Description must be between 2 and 500 characters"),
    (0, express_validator_1.body)("created_by")
        .trim()
        .notEmpty()
        .withMessage("Created by is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Created by must be between 2 and 50 characters"),
    (0, express_validator_1.body)("user_id").notEmpty().withMessage("User ID is required"),
    (0, express_validator_1.body)("image_url")
        .notEmpty()
        .withMessage("Image URL is required")
        .isURL()
        .withMessage("Please provide a valid image URL"),
];
exports.duckValidationRules = duckValidationRules;
