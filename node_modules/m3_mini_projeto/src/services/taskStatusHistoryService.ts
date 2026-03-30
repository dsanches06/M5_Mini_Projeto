import * as fetchTaskStatusHistory from "../api/fetchTaskStatusHistory.js";

/* Serviço para gerenciar histórico de status de tarefas */
export class TaskStatusHistoryService {
  /* Função para obter a lista de históricos de status de tarefas */
  static async getTaskStatusHistories(): Promise<any[]> {
    return await fetchTaskStatusHistory.getTaskStatusHistories();
  }

  /* Função para obter um histórico de status de tarefa por ID */
  static async getTaskStatusHistoryById(id: number): Promise<any | null> {
    return await fetchTaskStatusHistory.getTaskStatusHistoryById(id);
  }

  /* Função para criar um novo histórico de status de tarefa */
  static async createTaskStatusHistory(history: any): Promise<any | null> {
    return await fetchTaskStatusHistory.createTaskStatusHistory(history);
  }

  /* Função para atualizar um histórico de status de tarefa existente */
  static async updateTaskStatusHistory(id: number, history: any): Promise<any | null> {
    return await fetchTaskStatusHistory.updateTaskStatusHistory(id, history);
  }

  /* Função para excluir um histórico de status de tarefa */
  static async deleteTaskStatusHistory(id: number): Promise<boolean> {
    return await fetchTaskStatusHistory.deleteTaskStatusHistory(id);
  }
}
