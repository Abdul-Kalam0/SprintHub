import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import memberRoutes from "./routes/workspaceMember.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SprintHub Api is running",
  });
});

// User route
app.use("/api/auth", authRoutes);

// Workspace route
app.use("/api/workspaces", workspaceRoutes);

// Workspace members routes
app.use("/api/workspaces", memberRoutes);

//Project routes
app.use("/api/workspaces", projectRoutes);

//Task routes
app.use("/api/projects", taskRoutes);
// ✅ Always the last middleware
app.use(errorHandler);
export default app;
