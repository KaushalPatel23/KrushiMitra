import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { getUserProfile } from "../services/user.service.js";

export const profileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Authenticated user ID is missing");
    }

    const profile = await getUserProfile(userId);

    return successResponse(res, profile, "User profile loaded");
  } catch (error) {
    return next(error);
  }
};
