import * as sprintService from "../services/sprintService.js";

/* Função para obter todas as sprints */
export const getSprints = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const sprints = await sprintService.getAllSprints(search, sort);
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar sprints: ${error.message}` });
  }
};

/* Função para criar sprint */
export const createSprint = async (req, res) => {
  try {
    const { nome, data_inicio, data_fim } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode estar vazio" });
    }

    if (nome.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter no mínimo 3 caracteres" });
    }

    if (!data_inicio) {
      return res.status(400).json({ error: "Data de início é obrigatória" });
    }

    if (!data_fim) {
      return res.status(400).json({ error: "Data de fim é obrigatória" });
    }

    const sprint = await sprintService.createSprint(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar sprint: ${error.message}` });
  }
};

/* Função para atualizar sprint */
export const updateSprint = async (req, res) => {
  try {
    const { nome } = req.body;

    if (nome !== undefined && nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome da sprint não pode estar vazio" });
    }

    if (nome !== undefined && nome.length < 3) {
      return res.status(400).json({ error: "O nome da sprint deve ter no mínimo 3 caracteres" });
    }

    const affectedRows = await sprintService.updateSprint(Number(req.params.id), req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }
    res.json({ message: "Sprint atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: `Erro ao atualizar sprint: ${error.message}` });
  }
};

/* Função para deletar sprint */
export const deleteSprint = async (req, res) => {
  try {
    const affectedRows = await sprintService.deleteSprint(Number(req.params.id));
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint não encontrada" });
    }
    res.status(200).json({ message: "Sprint deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar sprint: ${error.message}` });
  }
};

