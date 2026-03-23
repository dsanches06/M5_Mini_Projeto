import { db } from "../db.js";

/* Função para buscar todas as tarefas */
export const getAllTasks = async (search, sort) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

/* Função para criar tarefa */
export const createTask = async (data) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

/* Função para atualizar tarefa */
export const updateTask = async (taskId, data) => {
  try {
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
    const completedTasks = tasks.filter((t) => t.data_conclusao !== null).length;
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
