import * as projectService from "../services/projectService.js";

export const getProjects = (req, res) => {
  const projects = projectService.getAllProjects();
  res.json(projects);
};

export const createProject = (req, res) => {
  const project = projectService.createProject(req.body);
  res.status(201).json(project);
};

export const updateProject = (req, res) => {
  const project = projectService.updateProject(Number(req.params.id), req.body);
  res.json(project);
};

export const deleteProject = (req, res) => {
  projectService.deleteProject(Number(req.params.id));
  res.json({ message: "Project deleted successfully" });
};
