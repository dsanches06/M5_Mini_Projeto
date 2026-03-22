import { db } from "../db.js";

/* Função para buscar todas as tarefas */
export const getAllTasks = async (search, sort) => {
  try {
    let [tasks] = await db.query("SELECT * FROM tarefa");

    if (search) {
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.userId.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
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
  } catch (error) {
    throw error;
  }
};

/* Função para criar tarefa */
export const createTask = async (data) => {
  try {
    const [result] = await db.query(
      "INSERT INTO tarefa (titulo, categoria, responsavel, concluida) VALUES (?, ?, ?, ?)",
      [data.title, data.category, data.userId, 0],
    );
    return { id: result.insertId, ...data, completed: 0 };
  } catch (error) {
    throw error;
  }
};

/* Função para atualizar tarefa */
export const updateTask = async (taskId, data) => {
  try {
    const { title, category, userId, completed, completedDate } = data;
    const [result] = await db.query(
      "UPDATE tarefa SET titulo=?, categoria=?, responsavel=?, concluida=?, data_conclusao=? WHERE id=?",
      [title, category, userId, completed, completedDate, taskId],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

/* Função para deletar tarefa */
export const deleteTask = async (taskId) => {
  try {
    await db.query("DELETE FROM etiqueta_tarefa WHERE id_tarefa=?", [taskId]);
    await db.query("DELETE FROM comentario WHERE id_tarefa=?", [taskId]);
    const [result] = await db.query("DELETE FROM tarefa WHERE id=?", [taskId]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

/* Função para buscar tarefa por ID */
export const getTaskById = async (taskId) => {
  try {
    const [tasks] = await db.query("SELECT * FROM tarefa WHERE id = ?", [taskId]);
    return tasks[0];
  } catch (error) {
    throw error;
  }
};

/* Função para adicionar etiqueta à tarefa */
export const addTagToTask = async (taskId, tagId) => {
  try {
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

    return { taskId, tagId };
  } catch (error) {
    throw error;
  }
};

/* Função para remover etiqueta da tarefa */
export const removeTagFromTask = async (taskId, tagId) => {
  try {
    const [result] = await db.query(
      "DELETE FROM etiqueta_tarefa WHERE id_tarefa = ? AND id_etiqueta = ?",
      [taskId, tagId],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

/* Função para buscar etiquetas da tarefa */
export const getTagsByTaskId = async (taskId) => {
  try {
    const [relations] = await db.query(
      "SELECT * FROM etiqueta_tarefa WHERE id_tarefa = ?",
      [taskId],
    );
    return relations;
  } catch (error) {
    throw error;
  }
};

/* Função para remover etiqueta de todas as tarefas */
export const removeTagFromAllTasks = async (tagId) => {
  try {
    const [result] = await db.query(
      "DELETE FROM etiqueta_tarefa WHERE id_etiqueta = ?",
      [tagId],
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

/* Função para buscar estatísticas das tarefas */
export const getTaskStats = async () => {
  try {
    const tasks = await getAllTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.concluida).length;
    const pendingTasks = totalTasks - completedTasks;
    const completedPercentage =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completedPercentage: completedPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};
