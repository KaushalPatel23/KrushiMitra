import { ApiError } from "../utils/apiError.js";
import { createAnalysis, deleteAnalysisById, getAnalysisById, getAnalysesByUserId } from "../repositories/analysis.repository.js";
import type { AnalysisCreateDto } from "../types/dto.js";

export const createCropAnalysis = async (input: AnalysisCreateDto, userId: string) => {
  const analysis = await createAnalysis(input, userId);

  return {
    ...analysis,
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
};

export const listCropAnalyses = async (userId: string) => {
  const analyses = await getAnalysesByUserId(userId);

  return analyses.map((analysis) => ({
    ...analysis,
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  }));
};

export const getCropAnalysis = async (id: string) => {
  const analysis = await getAnalysisById(id);

  if (!analysis) {
    throw new ApiError(404, "Analysis not found");
  }

  return {
    ...analysis,
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
};

export const removeCropAnalysis = async (id: string) => {
  const existing = await getAnalysisById(id);

  if (!existing) {
    throw new ApiError(404, "Analysis not found");
  }

  return deleteAnalysisById(id);
};
