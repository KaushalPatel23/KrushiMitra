import { body, param } from "express-validator";

export const analysisCreateValidator = [
  body("imageUrl").trim().isURL().withMessage("imageUrl must be a valid URL."),
  body("cropName").trim().notEmpty().withMessage("cropName is required."),
  body("healthStatus").trim().notEmpty().withMessage("healthStatus is required."),
  body("confidence")
    .isFloat({ min: 0, max: 1 })
    .withMessage("confidence must be a number between 0 and 1."),
];

export const idParamValidator = [
  param("id").trim().notEmpty().withMessage("id parameter is required."),
];
