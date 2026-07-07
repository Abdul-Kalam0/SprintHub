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
import { authenticate } from "../middlewares/authenticate.middleware.js";

router.post("/signup", register);
router.post("/login", login);
router.post("google", googleLogin);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", authenticate, getCurrentUser);

export default router;
