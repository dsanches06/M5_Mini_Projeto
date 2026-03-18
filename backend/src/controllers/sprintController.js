import * as sprintService from "../services/sprintService.js";

/* Função para obter todas as sprints */
export const getSprints = (req, res) => {
  try {
    const { sort, search } = req.query;
    const sprints = sprintService.getAllSprints(search, sort);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar sprints: ${error.message}` });
  }
};

/* Função para criar sprint */
export const createSprint = (req, res) => {
  try {
    const { nome, dataInicio, dataFim } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode estar vazio" });
    }

    if (nome.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter no mínimo 3 caracteres" });
    }

    if (!dataInicio) {
      return res.status(400).json({ error: "Data de início é obrigatória" });
    }

    if (!dataFim) {
      return res.status(400).json({ error: "Data de fim é obrigatória" });
    }

    const sprint = sprintService.createSprint(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar sprint: ${error.message}` });
  }
};

/* Função para atualizar sprint */
export const updateSprint = (req, res) => {
  try {
    const { nome, dataInicio, dataFim } = req.body;

    if (nome !== undefined && nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode estar vazio" });
    }

    if (nome !== undefined && nome.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter no mínimo 3 caracteres" });
    }

    const sprint = sprintService.updateSprint(Number(req.params.id), req.body);
    res.json(sprint);
  } catch (error) {
    res.status(400).json({ error: `Erro ao atualizar sprint: ${error.message}` });
  }
};

/* Função para deletar sprint */
export const deleteSprint = (req, res) => {
  try {
    sprintService.deleteSprint(Number(req.params.id));
    res.status(200).json({ message: "Sprint deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar sprint: ${error.message}` });
  }
};

