import * as fetchTasks from "../api/fetchTasks.js";
import { ITask } from "../tasks/index.js";
import { TaskStatus } from "../tasks/TaskStatus.js";

/* Serviço para gerir tarefas */
export class TaskService {
  
  /* Obtém tarefas da API */
  static async getTasks(sort?: string, search?: string): Promise<ITask[]> {
    return await fetchTasks.getTasks(sort, search);
  }

  /* Obtém estatísticas de tarefas da API */
  static async getTaskStats(): Promise<any> {
    return await fetchTasks.getTaskStats();
  }

  /* Obtém tags de uma tarefa da API */
  static async getTaskTags(taskId: number): Promise<any[]> {
    return await fetchTasks.getTaskTags(taskId);
  }

  /* Obtém comentários de uma tarefa da API */
  static async getTaskComments(taskId: number): Promise<any[]> {
    return await fetchTasks.getTaskComments(taskId);
  }

  /* Cria um nova tarefa na API */
  static async createTask(taskData: Partial<ITask>): Promise<ITask | null> {
    return await fetchTasks.createTask(taskData);
  }

  /* Adiciona uma tag a uma tarefa na API */
  static async addTagToTask(taskId: number, tagData: any): Promise<any> {
    return await fetchTasks.addTagToTask(taskId, tagData);
  }

  /* Cria um comentário em uma tarefa na API */
  static async createTaskComment(
    taskId: number,
    commentData: any,
  ): Promise<any> {
    return await fetchTasks.createTaskComment(taskId, commentData);
  }

  /* Atualiza uma tarefa na API */
  static async updateTask(
    taskId: number,
    taskData: Partial<ITask>,
  ): Promise<ITask | null> {
    return await fetchTasks.updateTask(taskId, taskData);
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
