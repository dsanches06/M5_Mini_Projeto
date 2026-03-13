import express from "express";
import * as userController from "../controllers/userController.js";
import { checkUserExists } from "../midlewares/checkUserExists.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/stats", userController.getStats);
router.post("/", userController.createUser);
router.put("/:id", checkUserExists, userController.updateUser);
router.patch("/:id", checkUserExists, userController.toggleUserActive);
router.delete("/:id", checkUserExists, userController.deleteUser);

export default router;
