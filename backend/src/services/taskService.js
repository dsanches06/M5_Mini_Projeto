import { db } from "../db.js";

/* Função para buscar todas as tarefas */
export const getAllTasks = async (search, sort) => {
  let [tasks] = await db.query("SELECT * FROM task");

  if (search) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    tasks.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

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
    "INSERT INTO task (title, description, task_status_id, priority_id, category_id, project_id, estimated_hours, due_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.title,
      data.description,
      data.task_status_id,
      data.priority_id,
      data.category_id,
      data.project_id,
      data.estimated_hours,
      data.due_date || null,
    ],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar tarefa */
export const updateTask = async (taskId, data) => {
  // Constrói a query dinamicamente apenas com os campos fornecidos
  const fieldsToUpdate = [];
  const values = [];

  if (data.title !== undefined) {
    fieldsToUpdate.push("title = ?");
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fieldsToUpdate.push("description = ?");
    values.push(data.description);
  }
  if (data.task_status_id !== undefined) {
    fieldsToUpdate.push("task_status_id = ?");
    values.push(data.task_status_id);
  }
  if (data.priority_id !== undefined) {
    fieldsToUpdate.push("priority_id = ?");
    values.push(data.priority_id);
  }
  if (data.category_id !== undefined) {
    fieldsToUpdate.push("category_id = ?");
    values.push(data.category_id);
  }
  if (data.estimated_hours !== undefined) {
    fieldsToUpdate.push("estimated_hours = ?");
    values.push(data.estimated_hours);
  }
  if (data.due_date !== undefined) {
    fieldsToUpdate.push("due_date = ?");
    values.push(data.due_date);
  }
  if (data.completed_at !== undefined) {
    fieldsToUpdate.push("completed_at = ?");
    values.push(data.completed_at);
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  values.push(taskId);

  const [result] = await db.query(
    `UPDATE task SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows;
};

/* Função para deletar tarefa */
export const deleteTask = async (taskId) => {
  const [result] = await db.query("DELETE FROM task WHERE id=?", [taskId]);
  return result.affectedRows;
};

/* Função para buscar tarefa por ID */
export const getTaskById = async (taskId) => {
  const [tasks] = await db.query("SELECT * FROM task WHERE id = ?", [taskId]);
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
    "SELECT * FROM tags_task WHERE task_id = ? AND tag_id = ?",
    [taskId, tagId],
  );

  if (existing && existing.length > 0) {
    throw new Error("Etiqueta já associada à tarefa");
  }

  // Insere a relação
  const [result] = await db.query(
    "INSERT INTO tags_task (task_id, tag_id) VALUES (?, ?)",
    [taskId, tagId],
  );

  return { taskId, tagId, relationId: result.insertId };
};

/* Função para remover etiqueta da tarefa */
export const removeTagFromTask = async (taskId, tagId) => {
  const [result] = await db.query(
    "DELETE FROM tags_task WHERE task_id = ? AND tag_id = ?",
    [taskId, tagId],
  );
  return result.affectedRows;
};

/* Função para buscar etiquetas da tarefa */
export const getTagsByTaskId = async (taskId) => {
  const [relations] = await db.query(
    "SELECT * FROM tags_task WHERE task_id = ?",
    [taskId],
  );
  return relations;
};

/* Função para remover etiqueta de todas as tarefas */
export const removeTagFromAllTasks = async (tagId) => {
  const [result] = await db.query(
    "DELETE FROM tags_task WHERE tag_id = ?",
    [tagId],
  );
  return result.affectedRows;
};

/* Função para buscar estatísticas das tarefas */
export const getTaskStats = async () => {
  const [result] = await db.query("SELECT COUNT(*) as totalTasks FROM task");
  const totalTasks = result[0].totalTasks;

  const [completedResult] = await db.query(
    "SELECT COUNT(*) as completedTasks FROM task WHERE completed_at IS NOT NULL",
  );
  const completedTasks = completedResult[0].completedTasks;

  const pendingTasks = totalTasks - completedTasks;
  const completedPercentage =
    totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : "0.00";

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completedPercentage: completedPercentage + "%",
  };
};
