import express from "express";
import * as tagController from "../controllers/tagController.js";

const router = express.Router();

// Tags routes
router.get("/", tagController.getTags);
router.post("/", tagController.createTag);
router.delete("/:id", tagController.deleteTag);
router.get("/:id/tasks", tagController.getTagTasks);

export default router;
