import * as fetchTasks from "../api/fetchTasks.js";
import { mapToTask } from "../api/dto/mapperDTO.js";
import { ITask } from "../tasks/index.js";
import { TaskStatus } from "../tasks/TaskStatus.js";
import { TaskAssigneeService } from "./taskAssigneeService.js";
import {
  TagAPIResponse,
  TaskCommentAPIResponse,
  TaskStatsAPIResponse,
} from "../api/dto/index.js";

/* Serviço para gerir tarefas */
export class TaskService {
  /* Obtém tarefas da API com os assignees associados */
  static async getTasks(sort?: string, search?: string): Promise<ITask[]> {
    const data = await fetchTasks.getTasks(sort, search);
    const tasks = data.map(mapToTask);

    // Carregar assignees e associar a cada tarefa
    try {
      const assignees = await TaskAssigneeService.getTaskAssignees();

      // Para cada tarefa, encontrar os assignees correspondentes
      tasks.forEach((task) => {
        const taskAssignees = assignees.filter(
          (a) => a.task_id === task.getId(),
        );
        (task as any).setAssignees(taskAssignees);
        if (taskAssignees.length > 0) {
        }
      });
    } catch (error) {
      console.error("Erro ao carregar assignees para tarefas:", error);
    }

    return tasks;
  }

  /* Obtém tarefas de um projeto específico */
  static async getTasksByProject(
    projectId: number,
    sort?: string,
    search?: string,
  ): Promise<ITask[]> {
    const data = await fetchTasks.getTasksByProject(projectId, sort, search);
    const tasks = data.map(mapToTask);

    // Carregar assignees e associar a cada tarefa
    try {
      const assignees = await TaskAssigneeService.getTaskAssignees();

      // Para cada tarefa, encontrar os assignees correspondentes
      tasks.forEach((task) => {
        const taskAssignees = assignees.filter(
          (a) => a.task_id === task.getId(),
        );
        (task as any).setAssignees(taskAssignees);
        if (taskAssignees.length > 0) {
        }
      });
    } catch (error) {
      console.error("Erro ao carregar assignees para tarefas:", error);
    }

    return tasks;
  }

  /* Obtém uma tarefa por ID da API */
  static async getTaskById(taskId: number): Promise<ITask> {
    const data = await fetchTasks.getTaskById(taskId);
    if (!data) {
      throw new Error("Tarefa não encontrada");
    }
    return mapToTask(data);
  }

  /* Obtém estatísticas de tarefas da API */
  static async getTaskStats(): Promise<TaskStatsAPIResponse | null> {
    return await fetchTasks.getTaskStats();
  }

  /* Obtém tags de uma tarefa da API */
  static async getTaskTags(taskId: number): Promise<TagAPIResponse[]> {
    return await fetchTasks.getTaskTags(taskId);
  }

  /* Obtém comentários de uma tarefa da API */
  static async getTaskComments(
    taskId: number,
  ): Promise<TaskCommentAPIResponse[]> {
    return await fetchTasks.getTaskComments(taskId);
  }

  /* Cria um nova tarefa na API */
  static async createTask(taskData: any): Promise<ITask | null> {
    return await fetchTasks.createTask(taskData);
  }

  /* Adiciona uma tag a uma tarefa na API */
  static async addTagToTask(taskId: number, tagData: any): Promise<any> {
    return await fetchTasks.addTagToTask(taskId, tagData);
  }

  /* Remove uma tag de uma tarefa na API */
  static async removeTagFromTask(taskId: number, tagId: number): Promise<boolean> {
    return await fetchTasks.removeTagFromTask(taskId, tagId);
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
    taskData: any,
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

  /* Atualiza o status de uma tarefa na API */
  static async updateTaskStatus(
    taskId: number,
    statusId: number,
  ): Promise<ITask | null> {
    return await fetchTasks.changeTaskStatus(taskId, statusId);
  }

  /* Deleta uma tarefa na API */
  static async deleteTask(taskId: number): Promise<boolean> {
    return await fetchTasks.deleteTask(taskId);
  }
}
