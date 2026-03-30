import * as fetchTaskStatus from "../api/fetchTaskStatus.js";

/* Serviço para gerenciar status de tarefas */
export class TaskStatusService {
  /* Função para obter a lista de status de tarefas */
  static async getTaskStatuses(): Promise<any[]> {
    return await fetchTaskStatus.getTaskStatuses();
  }

  /* Função para obter um status de tarefa por ID */
  static async getTaskStatusById(id: number): Promise<any | null> {
    return await fetchTaskStatus.getTaskStatusById(id);
  }

  /* Função para criar um novo status de tarefa */
  static async createTaskStatus(status: any): Promise<any | null> {
    return await fetchTaskStatus.createTaskStatus(status);
  }

  /* Função para atualizar um status de tarefa existente */
  static async updateTaskStatus(id: number, status: any): Promise<any | null> {
    return await fetchTaskStatus.updateTaskStatus(id, status);
  }

  /* Função para excluir um status de tarefa */
  static async deleteTaskStatus(id: number): Promise<boolean> {
    return await fetchTaskStatus.deleteTaskStatus(id);
  }
}
