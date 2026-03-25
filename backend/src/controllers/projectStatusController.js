import * as projectStatusService from "../services/projectStatusService.js";

export const getProjectStatuses = async (req, res) => {
  try {
    const projectStatuses = await projectStatusService.getAllProjectStatuses();
    res.json(projectStatuses);
  } catch (error) {
    res.status(500).json({ error: `Error fetching project statuses: ${error.message}` });
  }
};

export const createProjectStatus = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Status name cannot be empty" });
    }
    const projectStatus = await projectStatusService.createProjectStatus(req.body);
    res.status(201).json(projectStatus);
  } catch (error) {
    res.status(400).json({ error: `Error creating project status: ${error.message}` });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectStatusService.updateProjectStatus(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Project status not found" });
    }
    res.json({ message: "Project status updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating project status: ${error.message}` });
  }
};

export const deleteProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectStatusService.deleteProjectStatus(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Project status not found" });
    }
    res.json({ message: "Project status deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting project status: ${error.message}` });
  }
};
