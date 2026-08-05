import type { Request, Response, NextFunction } from "express";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import {
  createCropAnalysis,
  getCropAnalysis,
  listCropAnalyses,
  removeCropAnalysis,
} from "../services/analysis.service.js";

export const createAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Authenticated user ID is missing");
    }

    const analysis = await createCropAnalysis(req.body, userId);

    return createdResponse(res, analysis, "Analysis created successfully");
  } catch (error) {
    return next(error);
  }
};

export const listAnalysesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Authenticated user ID is missing");
    }

    const analyses = await listCropAnalyses(userId);

    return successResponse(res, analyses, "Analyses loaded successfully");
  } catch (error) {
    return next(error);
  }
};

export const getAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      throw new Error("Analysis id is required");
    }

    const analysis = await getCropAnalysis(id);

    return successResponse(res, analysis, "Analysis loaded successfully");
  } catch (error) {
    return next(error);
  }
};

export const deleteAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      throw new Error("Analysis id is required");
    }

    await removeCropAnalysis(id);

    return successResponse(res, null, "Analysis deleted successfully");
  } catch (error) {
    return next(error);
  }
};
