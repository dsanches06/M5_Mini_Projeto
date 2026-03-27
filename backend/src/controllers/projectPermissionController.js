import * as projectPermissionService from "../services/projectPermissionService.js";

export const getProjectPermissions = async (req, res) => {
  try {
    const projectPermissions = await projectPermissionService.getAllProjectPermissions();
    res.json(projectPermissions);
  } catch (error) {
    res.status(500).json({ error: `Error fetching project permissions: ${error.message}` });
  }
};

export const getProjectPermissionById = async (req, res) => {
  try {
    const projectPermission = await projectPermissionService.getProjectPermissionById(Number(req.params.id));
    if (!projectPermission) {
      return res.status(404).json({ error: "Project permission not found" });
    }
    res.json(projectPermission);
  } catch (error) {
    res.status(500).json({ error: `Error fetching project permission: ${error.message}` });
  }
};

export const createProjectPermission = async (req, res) => {
  try {
    const { project_id, user_id, permission } = req.body;
    if (!project_id || !user_id || !permission) {
      return res.status(400).json({ error: "project_id, user_id, and permission are required" });
    }
    const projectPermission = await projectPermissionService.createProjectPermission(req.body);
    res.status(201).json(projectPermission);
  } catch (error) {
    res.status(400).json({ error: `Error creating project permission: ${error.message}` });
  }
};

export const updateProjectPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectPermissionService.updateProjectPermission(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Project permission not found" });
    }
    res.json({ message: "Project permission updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating project permission: ${error.message}` });
  }
};

export const deleteProjectPermission = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await projectPermissionService.deleteProjectPermission(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Project permission not found" });
    }
    res.json({ message: "Project permission deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting project permission: ${error.message}` });
  }
};
