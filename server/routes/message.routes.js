import express from "express";
import { getMessages, sendMessage, markAsSeen } from "../controllers/message.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:userId", protectRoute, getMessages);
router.post("/send/:userId", protectRoute, sendMessage);
router.put("/seen/:userId", protectRoute, markAsSeen);

export default router;
