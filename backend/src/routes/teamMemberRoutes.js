import express from "express";
import * as teamMemberController from "../controllers/teamMemberController.js";

const router = express.Router();

router.get("/", teamMemberController.getTeamMembers);
router.get("/:id", teamMemberController.getTeamMemberById);
router.post("/", teamMemberController.createTeamMember);
router.put("/:id", teamMemberController.updateTeamMember);
router.delete("/:id", teamMemberController.deleteTeamMember);

export default router;
