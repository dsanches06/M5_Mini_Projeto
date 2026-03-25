import * as fetchTasks from "../api/fetchTasks.js";
import Comment from "../comments/Comment.js";
import { TaskService } from "./index.js";

/* Serviço para gerir comentários associados a tarefas */
export class CommentService {
  /* Obtém comentários de uma tarefa da API */
  static async getTaskComments(taskId: number): Promise<any[]> {
    return await fetchTasks.getTaskComments(taskId);
  }

  /* Cria um comentário em uma tarefa na API */
  static async createTaskComment(
    taskId: number,
    commentData: any,
  ): Promise<any> {
    return await fetchTasks.createTaskComment(taskId, commentData);
  }

  /* Atualiza um comentário na API */
  static async updateTaskComment(
    taskId: number,
    commentId: number,
    commentData: any,
  ): Promise<any> {
    return await fetchTasks.updateTaskComment(taskId, commentId, commentData);
  }
}
