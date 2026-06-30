import express from "express";
import {
  createGroup,
  getMyGroups,
  addMembersToGroup,
   leaveGroup,
} from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/", protectRoute, getMyGroups);

router.patch("/:groupId/add-members", protectRoute, addMembersToGroup);
router.patch("/:groupId/leave", protectRoute, leaveGroup);

export default router;