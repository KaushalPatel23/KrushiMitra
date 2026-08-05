import { ApiError } from "../utils/apiError.js";
import { getReportById, getReports } from "../repositories/report.repository.js";

export const listReports = async () => {
  const reports = await getReports();

  return reports.map((report) => ({
    ...report,
    createdAt: report.createdAt.toISOString(),
  }));
};

export const getReport = async (id: string) => {
  const report = await getReportById(id);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  return {
    ...report,
    createdAt: report.createdAt.toISOString(),
  };
};
