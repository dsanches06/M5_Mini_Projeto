import * as taskDependencyService from "../services/taskDependencyService.js";

export const getTaskDependencies = async (req, res) => {
  try {
    const taskDependencies = await taskDependencyService.getAllTaskDependencies();
    res.json(taskDependencies);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task dependencies: ${error.message}` });
  }
};

export const getTaskDependencyById = async (req, res) => {
  try {
    const taskDependency = await taskDependencyService.getTaskDependencyById(Number(req.params.id));
    if (!taskDependency) {
      return res.status(404).json({ error: "Task dependency not found" });
    }
    res.json(taskDependency);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task dependency: ${error.message}` });
  }
};

export const createTaskDependency = async (req, res) => {
  try {
    const { task_id, depends_on_task_id } = req.body;
    if (!task_id || !depends_on_task_id) {
      return res.status(400).json({ error: "task_id and depends_on_task_id are required" });
    }
    const taskDependency = await taskDependencyService.createTaskDependency(req.body);
    res.status(201).json(taskDependency);
  } catch (error) {
    res.status(400).json({ error: `Error creating task dependency: ${error.message}` });
  }
};

export const updateTaskDependency = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskDependencyService.updateTaskDependency(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task dependency not found" });
    }
    res.json({ message: "Task dependency updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating task dependency: ${error.message}` });
  }
};

export const deleteTaskDependency = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskDependencyService.deleteTaskDependency(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task dependency not found" });
    }
    res.json({ message: "Task dependency deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting task dependency: ${error.message}` });
  }
};
