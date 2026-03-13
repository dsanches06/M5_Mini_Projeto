import express from "express";
import * as sprintController from "../controllers/sprintController.js";

const router = express.Router();

router.get("/", sprintController.getSprints);
router.post("/", sprintController.createSprint);
router.put("/:id", sprintController.updateSprint);
router.delete("/:id", sprintController.deleteSprint);

export default router;