import * as tagTaskService from "../services/tagTaskService.js";

export const getTagTasks = async (req, res) => {
  try {
    const tagTasks = await tagTaskService.getAllTagTasks();
    res.json(tagTasks);
  } catch (error) {
    res.status(500).json({ error: `Error fetching tag tasks: ${error.message}` });
  }
};

export const createTagTask = async (req, res) => {
  try {
    const { task_id, tag_id } = req.body;
    if (!task_id || !tag_id) {
      return res.status(400).json({ error: "task_id and tag_id are required" });
    }
    const tagTask = await tagTaskService.createTagTask(req.body);
    res.status(201).json(tagTask);
  } catch (error) {
    res.status(400).json({ error: `Error creating tag task: ${error.message}` });
  }
};

export const updateTagTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await tagTaskService.updateTagTask(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tag task not found" });
    }
    res.json({ message: "Tag task updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating tag task: ${error.message}` });
  }
};

export const deleteTagTask = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await tagTaskService.deleteTagTask(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Tag task not found" });
    }
    res.json({ message: "Tag task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting tag task: ${error.message}` });
  }
};
