import express from "express";
import * as projectController from "../controllers/projectController.js";

const router = express.Router();

router.get("/", projectController.getProjects);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;