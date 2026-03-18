<<<<<<< HEAD
import { db } from "../db.js";
import * as taskService from "./taskService.js";
import * as userService from "./userService.js";

/* Função para buscar comentários de uma tarefa */
export const getCommentsByTaskId = async (taskId) => {
  const [comments] = await db.query(
    "SELECT * FROM comentario WHERE tarefaId = ? ORDER BY dataCriacao DESC",
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

  const user = await userService.getUserById(Number(data.usuarioId));
  if (!user) {
    throw new Error("User not found");
  }

  const [result] = await db.query(
    "INSERT INTO comentario (tarefaId, usuarioId, conteudo, dataCriacao) VALUES (?, ?, ?, ?)",
    [taskId, data.usuarioId, data.conteudo.trim(), new Date().toISOString()],
  );

  return {
    id: result.insertId,
    tarefaId: taskId,
    usuarioId: data.usuarioId,
    conteudo: data.conteudo.trim(),
    dataCriacao: new Date().toISOString(),
  };
};

/* Função para deletar comentário */
export const deleteComment = async (commentId) => {
  const [result] = await db.query("DELETE FROM comentario WHERE id=?", [
    commentId,
  ]);
  return result;
};
=======
import * as taskService from "./taskService.js";
import * as userService from "./userService.js";
import { db } from "../db.js";

/* Função para  */
export const getCommentsByTaskId = (taskId) => {
  return comments
    .filter((c) => c.taskId === taskId)
    .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
};

/* Função para  */
export const createComment = (taskId, data) => {
  const task = taskService.getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const user = userService.getUserById(Number(data.userId));
  if (!user) {
    throw new Error("User not found");
  }

  const comment = {
    taskId: taskId,
    userId: data.userId,
    conteudo: data.conteudo.trim(),
    dataCriacao: new Date().toISOString(),
  };

  comments.push(comment);
  return comment;
};

/* Função para  */
export const deleteComment = (commentId) => {
  const comment = comments.find((c) => c.id === commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  comments = comments.filter((c) => c.id !== commentId);
  return comment;
};
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
