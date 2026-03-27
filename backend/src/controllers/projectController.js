import * as projectService from "../services/projectService.js";

/* Função para obter todos os projetos */
export const getProjects = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const projects = await projectService.getAllProjects(search, sort);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: `Error fetching projects: ${error.message}` });
  }
};

/* Função para obter um projeto por ID */
export const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: `Error fetching project: ${error.message}` });
  }
};

/* Função para criar projeto */
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Project name cannot be empty" });
    }

    if (name.length < 3) {
      return res.status(400).json({ error: "Project name must have at least 3 characters" });
    }

    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: `Error creating project: ${error.message}` });
  }
};

/* Função para atualizar projeto */
export const updateProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ error: "Project name cannot be empty" });
    }

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({ error: "Project name must have at least 3 characters" });
    }

    const affectedRows = await projectService.updateProject(Number(req.params.id), req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating project: ${error.message}` });
  }
};

/* Função para deletar projeto */
export const deleteProject = async (req, res) => {
  try {
    const affectedRows = await projectService.deleteProject(Number(req.params.id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: `Error deleting project: ${error.message}` });
  }
};
