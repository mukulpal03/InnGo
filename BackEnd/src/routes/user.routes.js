import express from "express";
import { getProfile } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/profile", isLoggedIn, asyncHandler(getProfile));

export default router;
