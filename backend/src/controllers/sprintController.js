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
    const { name, start_date, end_date } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Sprint name cannot be empty" });
    }

    if (name.length < 3) {
      return res.status(400).json({ error: "Sprint name must have at least 3 characters" });
    }

    if (!start_date) {
      return res.status(400).json({ error: "Start date is required" });
    }

    if (!end_date) {
      return res.status(400).json({ error: "End date is required" });
    }

    const sprint = await sprintService.createSprint(req.body);
    res.status(201).json(sprint);
  } catch (error) {
    res.status(400).json({ error: `Error creating sprint: ${error.message}` });
  }
};

/* Função para atualizar sprint */
export const updateSprint = async (req, res) => {
  try {
    const { name } = req.body;

    if (name !== undefined && name.trim().length === 0) {
      return res.status(400).json({ error: "Sprint name cannot be empty" });
    }

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({ error: "Sprint name must have at least 3 characters" });
    }

    const affectedRows = await sprintService.updateSprint(Number(req.params.id), req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Sprint not found" });
    }
    res.json({ message: "Sprint updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating sprint: ${error.message}` });
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

