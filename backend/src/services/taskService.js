import { db } from "../db.js";

/* Função para buscar todas as tarefas */
export const getAllTasks = async (search, sort) => {
  let [tasks] = await db.query("SELECT * FROM tarefa");

  if (search) {
    tasks = tasks.filter(
      (t) =>
        t.titulo.toLowerCase().includes(search.toLowerCase()) ||
        t.descricao.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    tasks.sort((a, b) => {
      const titleA = a.titulo.toLowerCase();
      const titleB = b.titulo.toLowerCase();

      if (sort === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
  }

  return tasks;
};

/* Função para criar tarefa */
export const createTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO tarefa (titulo, descricao, id_estado_tarefa, id_prioridade, id_categoria, id_projeto, horas_estimadas, data_limite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.titulo,
      data.descricao,
      data.id_estado_tarefa,
      data.id_prioridade,
      data.id_categoria,
      data.id_projeto,
      data.horas_estimadas,
      data.data_limite || null,
    ],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar tarefa */
export const updateTask = async (taskId, data) => {
  // Constrói a query dinamicamente apenas com os campos fornecidos
  const fieldsToUpdate = [];
  const values = [];

  if (data.titulo !== undefined) {
    fieldsToUpdate.push("titulo = ?");
    values.push(data.titulo);
  }
  if (data.descricao !== undefined) {
    fieldsToUpdate.push("descricao = ?");
    values.push(data.descricao);
  }
  if (data.id_estado_tarefa !== undefined) {
    fieldsToUpdate.push("id_estado_tarefa = ?");
    values.push(data.id_estado_tarefa);
  }
  if (data.id_prioridade !== undefined) {
    fieldsToUpdate.push("id_prioridade = ?");
    values.push(data.id_prioridade);
  }
  if (data.id_categoria !== undefined) {
    fieldsToUpdate.push("id_categoria = ?");
    values.push(data.id_categoria);
  }
  if (data.horas_estimadas !== undefined) {
    fieldsToUpdate.push("horas_estimadas = ?");
    values.push(data.horas_estimadas);
  }
  if (data.data_limite !== undefined) {
    fieldsToUpdate.push("data_limite = ?");
    values.push(data.data_limite);
  }
  if (data.data_conclusao !== undefined) {
    fieldsToUpdate.push("data_conclusao = ?");
    values.push(data.data_conclusao);
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  values.push(taskId);

  const [result] = await db.query(
    `UPDATE tarefa SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows;
};

/* Função para deletar tarefa */
export const deleteTask = async (taskId) => {
  await db.query("DELETE FROM etiqueta_tarefa WHERE id_tarefa=?", [taskId]);
  await db.query("DELETE FROM comentario WHERE id_tarefa=?", [taskId]);
  const [result] = await db.query("DELETE FROM tarefa WHERE id=?", [taskId]);
  return result.affectedRows;
};

/* Função para buscar tarefa por ID */
export const getTaskById = async (taskId) => {
  const [tasks] = await db.query("SELECT * FROM tarefa WHERE id = ?", [taskId]);
  return tasks[0];
};

/* Função para adicionar etiqueta à tarefa */
export const addTagToTask = async (taskId, tagId) => {
  // Valida inputs
  if (!taskId || taskId <= 0) {
    throw new Error(`Tarefa ID inválida: ${taskId}`);
  }
  if (!tagId || tagId <= 0) {
    throw new Error(`Etiqueta ID inválida ou não fornecida: ${tagId}`);
  }

  // Valida se a tarefa existe
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error(`Tarefa com ID ${taskId} não encontrada`);
  }

  // Verifica se a tag já está associada
  const [existing] = await db.query(
    "SELECT * FROM etiqueta_tarefa WHERE id_tarefa = ? AND id_etiqueta = ?",
    [taskId, tagId],
  );

  if (existing && existing.length > 0) {
    throw new Error("Etiqueta já associada à tarefa");
  }

  // Insere a relação
  const [result] = await db.query(
    "INSERT INTO etiqueta_tarefa (id_tarefa, id_etiqueta) VALUES (?, ?)",
    [taskId, tagId],
  );

  return { taskId, tagId, relationId: result.insertId };
};

/* Função para remover etiqueta da tarefa */
export const removeTagFromTask = async (taskId, tagId) => {
  const [result] = await db.query(
    "DELETE FROM etiqueta_tarefa WHERE id_tarefa = ? AND id_etiqueta = ?",
    [taskId, tagId],
  );
  return result.affectedRows;
};

/* Função para buscar etiquetas da tarefa */
export const getTagsByTaskId = async (taskId) => {
  const [relations] = await db.query(
    "SELECT * FROM etiqueta_tarefa WHERE id_tarefa = ?",
    [taskId],
  );
  return relations;
};

/* Função para remover etiqueta de todas as tarefas */
export const removeTagFromAllTasks = async (tagId) => {
  const [result] = await db.query(
    "DELETE FROM etiqueta_tarefa WHERE id_etiqueta = ?",
    [tagId],
  );
  return result.affectedRows;
};

/* Função para buscar estatísticas das tarefas */
export const getTaskStats = async () => {
  const [result] = await db.query("SELECT COUNT(*) as totalTasks FROM tarefa");
  const totalTasks = result[0].totalTasks;

  const [completedResult] = await db.query("SELECT COUNT(*) as completedTasks FROM tarefa WHERE data_conclusao IS NOT NULL");
  const completedTasks = completedResult[0].completedTasks;

  const pendingTasks = totalTasks - completedTasks;
  const completedPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : "0.00";

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completedPercentage: completedPercentage + "%",
  };
};
