import express from "express";
import {
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/auth.controllers.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateUserRegister,
  validateUserLogin,
} from "../middlewares/validator.middleware.js";

const router = express.Router();

router.post("/register", validateUserRegister, asyncHandler(registerUser));
router.post("/verify/:token", asyncHandler(verifyUser));
router.post("/login", validateUserLogin, asyncHandler(loginUser));

export default router;
