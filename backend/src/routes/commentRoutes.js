import express from "express";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.get("/", commentController.getComments);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

export default router;
