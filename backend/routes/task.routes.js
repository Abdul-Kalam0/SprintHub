import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
const router = express.Router();

router.post("/projects/:projectId/tasks", authenticate, createTask);
router.use("/projects/:projectId/tasks", authenticate, getAllTasks);
router.use("/tasks/:taskId", getTask);
router.patch("/tasks/:taskId", authenticate, updateTask);
router.delete("/tasks/:taskId", authenticate, deleteTask);

export default router;
