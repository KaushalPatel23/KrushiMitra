import { Router } from "express";
import {
  createAnalysisController,
  deleteAnalysisController,
  getAnalysisController,
  listAnalysesController,
} from "../../controllers/analysis.controller.js";
import { authenticateJwt } from "../../middleware/auth.js";
import { analysisCreateValidator, idParamValidator } from "../../validators/analysis.validator.js";
import { validateRequest } from "../../utils/validateRequest.js";

const router = Router();

router.use(authenticateJwt);

router.post("/", analysisCreateValidator, validateRequest, createAnalysisController);
router.get("/", listAnalysesController);
router.get("/:id", idParamValidator, validateRequest, getAnalysisController);
router.delete("/:id", idParamValidator, validateRequest, deleteAnalysisController);

export default router;
