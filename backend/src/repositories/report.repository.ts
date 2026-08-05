import prisma from "../config/prisma.js";
import type { Report } from "../generated/prisma/client.js";

export const getReports = async (): Promise<Report[]> => {
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getReportById = async (id: string): Promise<Report | null> => {
  return prisma.report.findUnique({
    where: { id },
  });
};
