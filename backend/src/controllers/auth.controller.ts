import type { Request, Response, NextFunction } from "express";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body);

    return createdResponse(res, result, "User registered successfully");
  } catch (error) {
    return next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginUser(req.body);

    return successResponse(res, result, "Login successful");
  } catch (error) {
    return next(error);
  }
};
