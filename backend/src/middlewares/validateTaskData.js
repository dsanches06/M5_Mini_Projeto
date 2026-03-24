export const validateTaskData = (req, res, next) => {
  const {
    titulo,
    descricao,
    id_estado_tarefa,
    id_prioridade,
    id_categoria,
    id_projeto,
    horas_estimadas,
  } = req.body;

  if (!titulo || titulo.toString().trim().length === 0) {
    return res.status(400).json({ error: "Titulo é obrigatório" });
  }

  if (!descricao || descricao.toString().trim().length === 0) {
    return res.status(400).json({ error: "Descricao é obrigatória" });
  }

  if (
    id_estado_tarefa === undefined ||
    id_estado_tarefa === null ||
    id_estado_tarefa.toString().trim().length === 0
  ) {
    return res
      .status(400)
      .json({ error: "ID do estado da tarefa é obrigatório" });
  }

  if (
    id_prioridade === undefined ||
    id_prioridade === null ||
    id_prioridade.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "ID da prioridade é obrigatório" });
  }

  if (
    id_categoria === undefined ||
    id_categoria === null ||
    id_categoria.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "ID da categoria é obrigatório" });
  }

  if (
    id_projeto === undefined ||
    id_projeto === null ||
    id_projeto.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "ID do projeto é obrigatório" });
  }

  if (
    horas_estimadas === undefined ||
    horas_estimadas === null ||
    horas_estimadas.toString().trim().length === 0
  ) {
    return res.status(400).json({ error: "Horas estimadas é obrigatório" });
  }

  next();
};
