import { validationResult } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./apiError.js";

export const validateRequest = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req).array({ onlyFirstError: true }) as unknown as Array<{
    param: string;
    msg: string;
  }>;

  if (errors.length === 0) {
    return next();
  }

  const mappedErrors = errors.map((error) => ({
    field: error.param,
    message: error.msg,
  }));

  return next(new ApiError(400, "Validation failed", mappedErrors));
};
