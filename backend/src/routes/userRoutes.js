import express from "express";
import * as userController from "../controllers/userController.js";
import { checkUserExists } from "../middlewares/checkUserExists.js";

const router = express.Router();

router.use(checkUserExists);

router.get("/", userController.getUsers);
router.get("/stats", userController.getStats);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.patch("/:id", userController.toggleUserActive);
router.delete("/:id", userController.deleteUser);

//notificações
router.get("/:id/notifications", userController.getNotifications);

export default router;
