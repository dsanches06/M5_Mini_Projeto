import * as taskService from "../services/taskService.js";

export const getTasks = (req, res) => {
  const { sort, search } = req.query;
  const tasks = taskService.getAllTasks(search, sort);
  res.json(tasks);
};

export const createTask = (req, res) => {
  const task = taskService.createTask(req.body);
  res.status(201).json(task);
};

export const updateTask = (req, res) => {
  const task = taskService.updateTask(Number(req.params.id), req.body);
  res.json(task);
};

export const deleteTask = (req, res) => {
  taskService.deleteTask(Number(req.params.id));
  res.json({ message: "Task deleted successfully" });
};

export const getStats = (req, res) => {
  const stats = taskService.getTaskStats();
  res.json(stats);
};
