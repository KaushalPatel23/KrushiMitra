import prisma from "../config/prisma.js";
import type { AnalysisCreateDto } from "../types/dto.js";
import type { CropAnalysis } from "../generated/prisma/client.js";

export const createAnalysis = async (
  data: AnalysisCreateDto,
  userId: string
): Promise<CropAnalysis> => {
  return prisma.cropAnalysis.create({
    data: {
      imageUrl: data.imageUrl,
      cropName: data.cropName,
      healthStatus: data.healthStatus ?? "Pending",
      disease: data.disease ?? null,
      confidence: data.confidence ?? 0,
      fertilizer: data.fertilizer ?? null,
      pesticide: data.pesticide ?? null,
      recommendation: data.recommendation ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      userId,
    },
  });
};

export const getAnalysesByUserId = async (userId: string): Promise<CropAnalysis[]> => {
  return prisma.cropAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAnalysisById = async (id: string): Promise<CropAnalysis | null> => {
  return prisma.cropAnalysis.findUnique({
    where: { id },
  });
};

export const deleteAnalysisById = async (id: string): Promise<CropAnalysis> => {
  return prisma.cropAnalysis.delete({
    where: { id },
  });
};
