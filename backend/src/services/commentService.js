import { db } from "../db.js";
import * as taskService from "./taskService.js";
import * as userService from "./userService.js";

/* Função para buscar comentários de uma tarefa */
export const getCommentsByTaskId = async (taskId) => {
  try {
    const [comments] = await db.query(
      "SELECT * FROM comentario WHERE id_tarefa = ? ORDER BY data_comentario DESC",
      [taskId],
    );
    return comments;
  } catch (error) {
    throw error;
  }
};

/* Função para criar comentário */
export const createComment = async (taskId, data) => {
  try {
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const user = await userService.getUserById(Number(data.userId));
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const mysqlDateTime = now.toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query(
      "INSERT INTO comentario (id_tarefa, id_utilizador, texto, data_comentario) VALUES (?, ?, ?, ?)",
      [taskId, data.userId, data.content.trim(), mysqlDateTime],
    );

    return {
      id: result.insertId,
      taskId: taskId,
      userId: data.userId,
      content: data.content.trim(),
      date: mysqlDateTime,
    };
  } catch (error) {
    throw error;
  }
};

/* Função para deletar comentário */
export const deleteComment = async (commentId) => {
  try {
    const [result] = await db.query("DELETE FROM comentario WHERE id = ?", [
      commentId,
    ]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};

/* Função para marcar comentário como resolvido */
export const resolveComment = async (commentId, resolved) => {
  try {
    const [result] = await db.query(
      "UPDATE comentario SET resolvido = ? WHERE id = ?",
      [resolved ? 1 : 0, commentId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Comentário não encontrado");
    }

    const [updated] = await db.query("SELECT * FROM comentario WHERE id = ?", [
      commentId,
    ]);

    return updated[0];
  } catch (error) {
    throw error;
  }
};

/* Função para atualizar comentário */
export const updateComment = async (commentId, content) => {
  try {
    const now = new Date();
    const editDate = now.toISOString();

    const [result] = await db.query(
      "UPDATE comentario SET texto = ?, editado_em = ? WHERE id = ?",
      [content, editDate, commentId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Comentário não encontrado");
    }

    const [updated] = await db.query("SELECT * FROM comentario WHERE id = ?", [
      commentId,
    ]);

    return updated[0];
  } catch (error) {
    throw error;
  }
};
