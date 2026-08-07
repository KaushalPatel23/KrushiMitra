import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import { createdResponse, successResponse } from "../utils/apiResponse.js";
import {
  createCropAnalysis,
  getCropAnalysis,
  listCropAnalyses,
  removeCropAnalysis,
} from "../services/analysis.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createAnalysisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "Authenticated user ID is missing");
    }

    const file = req.file;
    const cropName = String(req.body.cropName ?? "").trim();
    const latitude = req.body.latitude != null ? Number(req.body.latitude) : null;
    const longitude = req.body.longitude != null ? Number(req.body.longitude) : null;

    if (!file) {
      throw new ApiError(400, "Image is required");
    }

    if (!cropName) {
      throw new ApiError(400, "cropName is required");
    }

    const uploadDir = path.join(__dirname, "../storage/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const uploadPath = path.join(uploadDir, filename);
    await fs.writeFile(uploadPath, file.buffer);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    const analysis = await createCropAnalysis(
      {
        imageUrl,
        cropName,
        healthStatus: "Pending",
        confidence: 0,
        latitude: Number.isFinite(latitude) ? latitude : null,
        longitude: Number.isFinite(longitude) ? longitude : null,
      },
      userId,
    );

    return createdResponse(
      res,
      {
        analysisId: analysis.id,
        cropName: analysis.cropName,
        imageUrl: analysis.imageUrl,
      },
      "Analysis created successfully",
    );
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
