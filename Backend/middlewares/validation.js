// middlewares/validation.js
import { body } from "express-validator";

export const signupValidation = [
    body("firstname")
    .isAlpha()
    .withMessage("Name must contain only letters"),
  

     body("lastname")
    .isAlpha()
    .withMessage("Name must contain only letters"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];



export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];