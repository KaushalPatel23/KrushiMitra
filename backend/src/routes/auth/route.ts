import { Router } from "express";
import { loginController, registerController } from "../../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../../validators/auth.validator.js";
import { validateRequest } from "../../utils/validateRequest.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, registerController);
router.post("/login", loginValidator, validateRequest, loginController);

export default router;
