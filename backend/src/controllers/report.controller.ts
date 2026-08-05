import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/apiResponse.js";
import { getReport, listReports } from "../services/report.service.js";

export const listReportsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reports = await listReports();

    return successResponse(res, reports, "Reports loaded successfully");
  } catch (error) {
    return next(error);
  }
};

export const getReportController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      throw new Error("Report id is required");
    }

    const report = await getReport(id);

    return successResponse(res, report, "Report loaded successfully");
  } catch (error) {
    return next(error);
  }
};
