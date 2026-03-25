import express from "express";
import * as taskAttachmentController from "../controllers/taskAttachmentController.js";

const router = express.Router();

router.get("/", taskAttachmentController.getTaskAttachments);
router.post("/", taskAttachmentController.createTaskAttachment);
router.put("/:id", taskAttachmentController.updateTaskAttachment);
router.delete("/:id", taskAttachmentController.deleteTaskAttachment);

export default router;
