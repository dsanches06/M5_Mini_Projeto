import * as projectService from "../services/projectService.js";

/* Função para obter todos os projetos */
export const getProjects = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const projects = await projectService.getAllProjects(search, sort);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar projetos: ${error.message}` });
  }
};

/* Função para criar projeto */
export const createProject = async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome do projeto não pode estar vazio" });
    }

    if (nome.length < 3) {
      return res.status(400).json({ error: "O nome do projeto deve ter no mínimo 3 caracteres" });
    }

    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar projeto: ${error.message}` });
  }
};

/* Função para atualizar projeto */
export const updateProject = async (req, res) => {
  try {
    const { nome } = req.body;

    if (nome !== undefined && nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome do projeto não pode estar vazio" });
    }

    if (nome !== undefined && nome.length < 3) {
      return res.status(400).json({ error: "O nome do projeto deve ter no mínimo 3 caracteres" });
    }

    const affectedRows = await projectService.updateProject(Number(req.params.id), req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.json({ message: "Projeto atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: `Erro ao atualizar projeto: ${error.message}` });
  }
};

/* Função para deletar projeto */
export const deleteProject = async (req, res) => {
  try {
    const affectedRows = await projectService.deleteProject(Number(req.params.id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    res.status(200).json({ message: "Projeto deletado com sucesso" });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar projeto: ${error.message}` });
  }
};
