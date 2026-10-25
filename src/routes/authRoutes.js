import { celebrate } from "celebrate";
import { Router } from "express";
import {
  loginUserSchema,
  registerSchema,
} from "../validation/authValidation.js";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";
const router = Router();

router.post("/register", celebrate(registerSchema), registerUser);
router.post("/login", celebrate(loginUserSchema), loginUser);
router.get("/me", authenticate, getMe);

export default router;
