import Comment from "../comments/Comment.js";
import { TaskService } from "./index.js";

/* Serviço para gerir comentários associados a tarefas */
export class CommentService {
  private static comments: Comment[] = [];
  private static count: number = 0;

  /* Adiciona um novo comentário a uma tarefa */
  static addComment(taskId: number, userId: number, message: string) {
    this.comments.push(new Comment((this.count += 1), taskId, userId, message));
  }

  /* Obtém todos os comentários associados a uma tarefa específica */
  static getComments(taskId: number) {
    return this.comments.filter((c) => c.getTaskId() === taskId);
  }

  /* Obtém um comentário pelo seu ID */
  static getCommentById(commentId: number) {
    return this.comments.find((c) => c.getId() === commentId);
  }

  /* Obtém a tarefa associada a um comentário pelo seu ID */
  static getTaskByCommentId(commentId: number) {
    const comment = this.getCommentById(commentId);
    return comment ? TaskService.getTaskById(comment.getTaskId()) : null;
  }

  /* Elimina um comentário pelo seu ID */
  static deleteComment(commentId: number) {
    const commentIndex = this.comments.findIndex(
      (c) => c.getId() === commentId,
    );
    if (commentIndex !== -1) {
      this.comments.splice(commentIndex, 1);
    }
  }

  /* Atualiza o texto de um comentário pelo seu ID */
  static updateComment(commentId: number, newMessage: string) {
    const comment = this.comments.find((c) => c.getId() === commentId);
    if (comment) {
      comment.setMessage(newMessage);
    }
  }


}

