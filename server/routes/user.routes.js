import express from "express";
import { getUsers, searchUsers, updateProfile, checkWaveId } from "../controllers/user.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route — no auth needed for signup availability check
router.get("/check-waveid", checkWaveId);

router.get("/", protectRoute, getUsers);
router.get("/search", protectRoute, searchUsers);
router.put("/profile", protectRoute, updateProfile);

export default router;
