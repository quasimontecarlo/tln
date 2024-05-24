import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { readUnreadUser, getUserProfile, updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
//router.get("/profile/:suggested", protectRoute, getUserProfile); similar for posts routes
router.post("/read/:id", protectRoute, readUnreadUser);
router.post("/update", protectRoute, updateUser);

export default router;