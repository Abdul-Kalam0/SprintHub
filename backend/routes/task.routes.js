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

app.post("/projects/:projectId/tasks", authenticate, createTask);
app.use("/projects/:projectId/tasks", authenticate, getAllTasks);
app.use("/tasks/:taskId", getTask);
app.patch("/tasks/:taskId", authenticate, updateTask);
app.delete("/tasks/:taskId", authenticate, deleteTask);

export default router;
