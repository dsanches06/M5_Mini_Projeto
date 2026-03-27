import express from "express";
import * as sprintController from "../controllers/sprintController.js";

const router = express.Router();

//Sprints routes
router.get("/", sprintController.getSprints);
router.get("/:id", sprintController.getSprintById);
router.post("/", sprintController.createSprint);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);

export default router;