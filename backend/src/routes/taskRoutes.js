import express from "express";
import * as taskController from "../controllers/taskController.js";
import { validateTaskData } from "../middlewares/validateTaskData.js";

const router = express.Router();

//Taks routes
router.get("/", taskController.getTasks);
router.get("/stats", taskController.getStats);
router.post("/", validateTaskData, taskController.createTask);
router.put("/:id", validateTaskData, taskController.updateTask);
router.patch("/:id", taskController.taskMarkedAsCompleted);
router.delete("/:id", taskController.deleteTask);

// Tags routes (must come before /:id routes)
router.post("/:id/tags", taskController.addTagToTask);
router.delete("/:id/tags/:tagId", taskController.removeTagFromTask);
router.get("/:id/tags", taskController.getTaskTags);

// Comments routes (must come before /:id routes)
router.post("/:id/comments", taskController.createComment);
router.get("/:id/comments", taskController.getComments);
router.patch("/:id/comments/:commentId", taskController.resolveComment);
router.put("/:id/comments/:commentId", taskController.updateComment);
router.delete("/:id/comments/:commentId", taskController.deleteComment);

export default router;
