import express from "express";
import { getProfile } from "../controllers/user.controllers.js";

const router = express.Router()

router.get('/profile', getProfile)

export default router;