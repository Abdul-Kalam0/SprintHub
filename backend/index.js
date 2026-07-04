import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SprintHub Api is running",
  });
});

app.use("/api/auth", authRoutes);

// ✅ Always the last middleware
app.use(errorHandler);
export default app;
