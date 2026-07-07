import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getAllWorkspace,
  getWorkspace,
  updateWorkspace,
} from "../controllers/workspace.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
const router = express.Router();

router.post("/", authenticate, createWorkspace);
router.get("/", authenticate, getAllWorkspace);
router.get("/:id", authenticate, getWorkspace);
router.patch("/:id", authenticate, updateWorkspace);
router.delete("/:id", authenticate, deleteWorkspace);

export default router;
