import express from "express";
const router = express.Router();
import {
  register,
  login,
  googleLogin,
  logout,
  refreshAccessToken,
  getCurrentUser,
} from "../controllers/auth.controller.js";

router.post("/signup", register);
router.post("/login", login);
router.post("google", googleLogin);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", getCurrentUser);

export default router;
