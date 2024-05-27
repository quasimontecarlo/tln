import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { writePage, deletePage, editPage, previousPage, isEdited, getAllPages, getMyPages, getRandomPages } from "../controllers/page.js";

const router = express.Router();

router.post("/write", protectRoute, writePage);
router.post("/edit/:id", protectRoute, editPage);
router.delete("/:id", protectRoute, deletePage);
router.get("/pp/:id", protectRoute, previousPage);
router.get("/edited/:id", protectRoute, isEdited);
router.get("/all", protectRoute, getAllPages);
router.get("/mine/:id", protectRoute, getMyPages);
router.get("/random", protectRoute, getRandomPages);

export default router;