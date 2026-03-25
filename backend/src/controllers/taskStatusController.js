import * as taskStatusService from "../services/taskStatusService.js";

export const getTaskStatuses = async (req, res) => {
  try {
    const taskStatuses = await taskStatusService.getAllTaskStatuses();
    res.json(taskStatuses);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task statuses: ${error.message}` });
  }
};

export const createTaskStatus = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Status name cannot be empty" });
    }
    const taskStatus = await taskStatusService.createTaskStatus(req.body);
    res.status(201).json(taskStatus);
  } catch (error) {
    res.status(400).json({ error: `Error creating task status: ${error.message}` });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskStatusService.updateTaskStatus(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task status not found" });
    }
    res.json({ message: "Task status updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating task status: ${error.message}` });
  }
};

export const deleteTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskStatusService.deleteTaskStatus(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task status not found" });
    }
    res.json({ message: "Task status deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting task status: ${error.message}` });
  }
};
