import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/:workspaceId/projects", authenticate, createProject);
router.get("/:workspaceId/projects", authenticate, getAllProjects);
router.get("/:workspaceId/projects/:projectId", authenticate, getProject);
router.patch("/:workspaceId/projects/:projectId", authenticate, updateProject);
router.delete("/:workspaceId/projects/:projectId", authenticate, deleteProject);

export default router;
