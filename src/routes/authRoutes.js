import { celebrate } from "celebrate";
import { Router } from "express";
import {
  loginUserSchema,
  registerSchema,
  refreshSchema,
} from "../validation/authValidation.js";
import {
  registerUser,
  loginUser,
  getMe,
  refresh,
  logOut,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";
const router = Router();

router.post("/register", celebrate(registerSchema), registerUser);
router.post("/login", celebrate(loginUserSchema), loginUser);
router.get("/me", authenticate, getMe);
router.post("/logout", celebrate(refreshSchema), authenticate, logOut);
router.post("/refresh", celebrate(refreshSchema), refresh);

export default router;
