import { Router } from "express";
import { forgotPassword, resetPassword } from "../controllers/Passwordreset.controller.js";
import { forgotPasswordLimiter } from "../middleware/ratelimiters.js";

const router = Router();

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;