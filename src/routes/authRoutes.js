import { celebrate } from "celebrate";
import { Router } from "express";
import {
  loginUserSchema,
  registerSchema,
} from "../validation/authValidation.js";
import { registerUser, LoginUser } from "../controllers/authController.js";
const router = Router();

router.post("/register", celebrate(registerSchema), registerUser);
router.post("/login", celebrate(loginUserSchema), LoginUser);

export default router;
