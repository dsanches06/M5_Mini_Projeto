import * as priorityService from "../services/priorityService.js";

export const getPriorities = async (req, res) => {
  try {
    const priorities = await priorityService.getAllPriorities();
    res.json(priorities);
  } catch (error) {
    res.status(500).json({ error: `Error fetching priorities: ${error.message}` });
  }
};

export const createPriority = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Priority name cannot be empty" });
    }
    const priority = await priorityService.createPriority(req.body);
    res.status(201).json(priority);
  } catch (error) {
    res.status(400).json({ error: `Error creating priority: ${error.message}` });
  }
};

export const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await priorityService.updatePriority(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating priority: ${error.message}` });
  }
};

export const deletePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await priorityService.deletePriority(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Priority not found" });
    }
    res.json({ message: "Priority deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting priority: ${error.message}` });
  }
};
