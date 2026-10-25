import { celebrate } from "celebrate";
import { Router } from "express";
import {
  loginUserSchema,
  registerSchema,
} from "../validation/authValidation.js";
import { registerUser } from "../controllers/authController.js";
const router = Router();

router.post("/register", celebrate(registerSchema), registerUser);

export default router;
