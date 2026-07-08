import express from "express";
import {
  addMember,
  deleteMember,
  getAllMember,
  updateMember,
} from "../controllers/workspaceMember.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
const router = express.Router();

router.post("/:workspaceId/members", authenticate, addMember);
router.get("/:workspaceId/members", authenticate, getAllMember);
router.patch("/:workspaceId/members/:memberId", authenticate, updateMember);
router.delete("/:workspaceId/members/:memberId", authenticate, deleteMember);

export default router;
