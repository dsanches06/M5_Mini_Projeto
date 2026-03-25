import * as sprintTaskService from "../services/sprintTaskService.js";

export const getSprintTasks = async (req, res) => {
  try {
    const sprintTasks = await sprintTaskService.getAllSprintTasks();
    res.json(sprintTasks);
  } catch (error) {
    res.status(500).json({ error: `Error fetching sprint tasks: ${error.message}` });
  }
};

export const createSprintTask = async (req, res) => {
  try {
    const { sprint_id, task_id } = req.body;
    if (!sprint_id || !task_id) {
      return res.status(400).json({ error: "sprint_id and task_id are required" });
    }
    const sprintTask = await sprintTaskService.createSprintTask(req.body);
    res.status(201).json(sprintTask);
  } catch (error) {
    res.status(400).json({ error: `Error creating sprint task: ${error.message}` });
  }
};

export const updateSprintTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await sprintTaskService.updateSprintTask(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint task not found" });
    }
    res.json({ message: "Sprint task updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating sprint task: ${error.message}` });
  }
};

export const deleteSprintTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await sprintTaskService.deleteSprintTask(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint task not found" });
    }
    res.json({ message: "Sprint task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting sprint task: ${error.message}` });
  }
};
