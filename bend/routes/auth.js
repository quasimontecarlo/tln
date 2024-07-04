import express from "express";
import { getMe, login, logout, signup, deleteUser } from "../controllers/auth.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", protectRoute, deleteUser);

export default router;