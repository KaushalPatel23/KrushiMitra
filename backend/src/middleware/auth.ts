import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { findUserById } from "../repositories/user.repository.js";

export const authenticateJwt = async (
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

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string; email?: string };

    const user = await findUserById(payload.sub);

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};
