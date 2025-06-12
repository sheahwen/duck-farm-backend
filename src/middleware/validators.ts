import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

// Validation middleware
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("validation error", JSON.stringify(errors.array()));
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// User validation rules
const userValidationRules: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("created_by")
    .trim()
    .notEmpty()
    .withMessage("Created by is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Created by must be between 2 and 50 characters"),
];

// Duck validation rules
const duckValidationRules: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2, max: 500 })
    .withMessage("Description must be between 2 and 500 characters"),

  body("created_by")
    .trim()
    .notEmpty()
    .withMessage("Created by is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Created by must be between 2 and 50 characters"),

  body("user_id").notEmpty().withMessage("User ID is required"),

  body("image_url")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Please provide a valid image URL"),
];

export { validate, userValidationRules, duckValidationRules };
