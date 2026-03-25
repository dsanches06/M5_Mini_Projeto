import * as taskStatusHistoryService from "../services/taskStatusHistoryService.js";

export const getTaskStatusHistories = async (req, res) => {
  try {
    const taskStatusHistories = await taskStatusHistoryService.getAllTaskStatusHistories();
    res.json(taskStatusHistories);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task status histories: ${error.message}` });
  }
};

export const createTaskStatusHistory = async (req, res) => {
  try {
    const { task_id, status_id } = req.body;
    if (!task_id || !status_id) {
      return res.status(400).json({ error: "task_id and status_id are required" });
    }
    const taskStatusHistory = await taskStatusHistoryService.createTaskStatusHistory(req.body);
    res.status(201).json(taskStatusHistory);
  } catch (error) {
    res.status(400).json({ error: `Error creating task status history: ${error.message}` });
  }
};

export const updateTaskStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskStatusHistoryService.updateTaskStatusHistory(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task status history not found" });
    }
    res.json({ message: "Task status history updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating task status history: ${error.message}` });
  }
};

export const deleteTaskStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskStatusHistoryService.deleteTaskStatusHistory(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task status history not found" });
    }
    res.json({ message: "Task status history deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting task status history: ${error.message}` });
  }
};
