import { Router } from "express";
import { getReportController, listReportsController } from "../../controllers/report.controller.js";
import { idParamValidator } from "../../validators/analysis.validator.js";
import { validateRequest } from "../../utils/validateRequest.js";

const router = Router();

router.get("/", listReportsController);
router.get("/:id", idParamValidator, validateRequest, getReportController);

export default router;
