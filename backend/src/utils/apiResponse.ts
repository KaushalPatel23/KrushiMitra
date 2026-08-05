import type { Response } from "express";

export const successResponse = <T>(res: Response, data: T, message = "Success") => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const createdResponse = <T>(res: Response, data: T, message = "Created") => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};
