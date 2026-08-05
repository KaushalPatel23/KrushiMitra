import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authorization header is missing or invalid"));
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return next(new ApiError(401, "Bearer token is missing"));
  }

  // JWT verification is stubbed for now.
  req.user = {
    id: "stub-user-id",
    email: "user@example.com",
    name: "KrushiMitr User",
  };

  return next();
};
