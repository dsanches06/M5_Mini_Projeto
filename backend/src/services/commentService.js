import { db } from "../db.js";
import * as taskService from "./taskService.js";
import * as userService from "./userService.js";

/* Função para buscar comentários de uma tarefa */
export const getCommentsByTaskId = async (taskId) => {
  const [comments] = await db.query(
    "SELECT * FROM comentario WHERE id_tarefa = ? ORDER BY data_comentario DESC",
    [taskId],
  );
  return comments;
};

/* Função para criar comentário */
export const createComment = async (taskId, data) => {
  const task = await taskService.getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const user = await userService.getUserById(Number(data.userId));
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');

  const [result] = await db.query(
    "INSERT INTO comentario (id_tarefa, id_utilizador, texto, data_comentario) VALUES (?, ?, ?, ?)",
    [taskId, data.userId, data.conteudo.trim(), mysqlDateTime],
  );

  return {
    id: result.insertId,
    id_tarefa: taskId,
    id_utilizador: data.userId,
    texto: data.conteudo.trim(),
    data_comentario: mysqlDateTime,
  };
};

/* Função para deletar comentário */
export const deleteComment = async (commentId) => {
  const [result] = await db.query("DELETE FROM comentario WHERE id = ?", [
    commentId,
  ]);
  return result;
};
