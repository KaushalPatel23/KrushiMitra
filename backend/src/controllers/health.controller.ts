import type { Request, Response } from "express";

export const healthController = (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "KrushiMitr Backend Running",
    version: "1.0.0",
  });
};
