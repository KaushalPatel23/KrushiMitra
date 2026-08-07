import { body, param } from "express-validator";

export const analysisCreateValidator = [
  body("cropName").trim().notEmpty().withMessage("cropName is required."),
];

export const idParamValidator = [
  param("id").trim().notEmpty().withMessage("id parameter is required."),
];
