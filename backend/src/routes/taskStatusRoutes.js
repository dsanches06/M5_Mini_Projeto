import express from "express";
import * as taskStatusController from "../controllers/taskStatusController.js";

const router = express.Router();

router.get("/", taskStatusController.getTaskStatuses);
router.post("/", taskStatusController.createTaskStatus);
router.put("/:id", taskStatusController.updateTaskStatus);
router.delete("/:id", taskStatusController.deleteTaskStatus);

export default router;
