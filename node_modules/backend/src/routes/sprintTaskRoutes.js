import express from "express";
import * as sprintTaskController from "../controllers/sprintTaskController.js";

const router = express.Router();

router.get("/", sprintTaskController.getSprintTasks);
router.get("/:id", sprintTaskController.getSprintTaskById);
router.post("/", sprintTaskController.createSprintTask);
router.put("/:id", sprintTaskController.updateSprintTask);
router.delete("/:id", sprintTaskController.deleteSprintTask);

export default router;
