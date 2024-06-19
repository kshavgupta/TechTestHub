import express from "express";
import {
  register,
  login,
  // googleAuth,
  // googleAuthCallback,
  // googleAuthRedirect,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/google", googleAuth);
// router.get("/google/callback", googleAuthCallback, googleAuthRedirect);

export default router;
