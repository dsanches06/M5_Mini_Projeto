import * as userService from "../services/userService.js";

export const getUsers = (req, res) => {
  const { sort, search } = req.query;
  const users = userService.getAllUsers(search, sort);
  res.json(users);
};

export const createUser = (req, res) => {
  const user = userService.createUser(req.body);
  res.status(201).json(user);
};

export const updateUser = (req, res) => {
  const user = userService.updateUser(Number(req.params.id), req.body);
  res.json(user);
};

export const deleteUser = (req, res) => {
  userService.deleteUser(Number(req.params.id));
  res.json({ message: "User deleted successfully" });
};

export const toggleUserActive = (req, res) => {
  const user = userService.toggleUserActive(Number(req.params.id));
  res.json(user);
}

export const getStats = (req, res) => {
  const stats = userService.getUserStats();
  res.json(stats);
}
