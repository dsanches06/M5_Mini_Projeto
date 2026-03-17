import * as userService from "../services/userService.js";
import * as notificationService from "../services/notificationService.js";

export const getUsers = (req, res) => {
  const { sort, search } = req.query;
  const users = userService.getAllUsers(search, sort);
  res.json(users);
};

export const createUser = (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({
        error: `O nome ${name} tem que ter 3 caracteres no minimo!`,
      });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        error: `O email ${email} é inválido!`,
      });
    }

    const user = userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = (req, res) => {
  try {
    const { name, email } = req.body;

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({
        error: `O nome ${name} tem que ter 3 caracteres no minimo!`,
      });
    }

    if (email !== undefined && !email.includes("@")) {
      return res.status(400).json({
        error: `O email ${email} é inválido!`,
      });
    }

    const user = userService.updateUser(Number(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = (req, res) => {
  userService.deleteUser(Number(req.params.id));
  res.json({ message: "User deleted successfully" });
};

export const toggleUserActive = (req, res) => {
  const user = userService.toggleUserActive(Number(req.params.id));
  res.json(user);
};

export const getStats = (req, res) => {
  const stats = userService.getUserStats();
  res.json(stats);
};

export const getNotifications = (req, res) => {
  try {
    const userId = Number(req.params.id);
    const notifications = notificationService.getNotificationsByUserId(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
