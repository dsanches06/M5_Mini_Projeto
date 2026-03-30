import express from "express";
import * as projectController from "../controllers/projectController.js";
import { validateProjectData } from "../middlewares/validateProjectData.js";

const router = express.Router();

//Projects routes
router.get("/", projectController.getProjects);
router.get("/:id", projectController.getProjectById);
router.post("/", validateProjectData, projectController.createProject);
router.put("/:id", validateProjectData, projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;