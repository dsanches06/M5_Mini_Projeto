import express from "express";
import * as taskController from "../controllers/taskController.js";

const router = express.Router();

//Taks routes
router.get("/", taskController.getTasks);
router.get("/stats", taskController.getStats);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Tags routes
router.post("/:id/tags", taskController.addTagToTask);
router.delete("/:id/tags", taskController.removeTagFromTask);
router.get("/:id/tags", taskController.getTaskTags);

// Comments routes
router.post("/:id/comments", taskController.createComment);
router.get("/:id/comments", taskController.getComments);
<<<<<<< HEAD
router.delete("/:id/comments/:commentId", taskController.deleteComment);
=======
router.delete("/:id/comments/:id", taskController.deleteComment);
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0

export default router;