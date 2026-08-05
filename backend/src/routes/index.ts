import { Router } from "express";
import authRoute from "./auth/route.js";
import healthRoute from "./health/route.js";
import analysisRoute from "./analysis/route.js";
import reportsRoute from "./reports/route.js";
import usersRoute from "./users/route.js";

const router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/users", usersRoute);
router.use("/analysis", analysisRoute);
router.use("/reports", reportsRoute);

export default router;