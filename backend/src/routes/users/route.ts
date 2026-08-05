import { Router } from "express";
import { profileController } from "../../controllers/user.controller.js";
import { authenticateJwt } from "../../middleware/auth.js";

const router = Router();

router.get("/profile", authenticateJwt, profileController);

export default router;
