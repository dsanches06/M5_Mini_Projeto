import * as taskAssigneesService from "../services/taskAssigneesService.js";

export const getTaskAssignees = async (req, res) => {
  try {
    const taskAssignees = await taskAssigneesService.getAllTaskAssignees();
    res.json(taskAssignees);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task assignees: ${error.message}` });
  }
};

export const getTaskAssigneeByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    
    const taskAssignee = await taskAssigneesService.getTaskAssigneeByUserId(Number(id));
    if (!taskAssignee || taskAssignee.length === 0) {
      return res.status(404).json({ error: "Task assignee not found" });
    }
    res.json(taskAssignee);
  } catch (error) {
    res.status(400).json({ error: `Error fetching task assignee: ${error.message}` });
  }
};

export const createTaskAssignee = async (req, res) => {
  try {
    const { task_id, user_id } = req.body;
    if (!task_id || !user_id) {
      return res.status(400).json({ error: "task_id and user_id are required" });
    }
    const taskAssignee = await taskAssigneesService.createTaskAssignee(req.body);
    res.status(201).json(taskAssignee);
  } catch (error) {
    res.status(400).json({ error: `Error creating task assignee: ${error.message}` });
  }
};

export const updateTaskAssignee = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAssigneesService.updateTaskAssignee(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task assignee not found" });
    }
    res.json({ message: "Task assignee updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating task assignee: ${error.message}` });
  }
};

export const deleteTaskAssignee = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskAssigneesService.deleteTaskAssignee(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task assignee not found" });
    }
    res.json({ message: "Task assignee deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting task assignee: ${error.message}` });
  }
};
