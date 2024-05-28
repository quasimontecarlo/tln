import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { writePage, deletePage, editPage, previousPage, isEdited, getAllPages, getMyPages, getRandomPages, getReadingPages, getUserPages } from "../controllers/page.js";

const router = express.Router();

router.post("/write", protectRoute, writePage);
router.post("/edit/:id", protectRoute, editPage);
router.delete("/:id", protectRoute, deletePage);
router.get("/pp/:id", protectRoute, previousPage);
router.get("/edited/:id", protectRoute, isEdited);
router.get("/all", protectRoute, getAllPages);
router.get("/mine/:id", protectRoute, getMyPages);
router.get("/random", protectRoute, getRandomPages);
router.get("/reading", protectRoute, getReadingPages);
router.get("/user/:username", protectRoute, getUserPages);

export default router;