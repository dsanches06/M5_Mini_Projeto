import { get, getById, create, put, remove } from "./index.js";
import { TaskStatusHistoryAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_status_history";
/* Função para obter a lista do histórico de status de tarefas */export async function getTaskStatusHistories(sort?: string, search?: string): Promise<TaskStatusHistoryAPIResponse[]> {
  return get<TaskStatusHistoryAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um registro de histórico de status por ID */
export async function getTaskStatusHistoryById(id: number): Promise<TaskStatusHistoryAPIResponse | null> {
  return getById<TaskStatusHistoryAPIResponse>(ENDPOINT, id);
}
/* Função para criar um novo registro de histórico de status */export async function createTaskStatusHistory(history: Partial<TaskStatusHistoryAPIResponse>): Promise<TaskStatusHistoryAPIResponse | null> {
  return create<TaskStatusHistoryAPIResponse>(ENDPOINT, history);
}

export async function updateTaskStatusHistory(id: number, history: Partial<TaskStatusHistoryAPIResponse>): Promise<TaskStatusHistoryAPIResponse | null> {
  return put<TaskStatusHistoryAPIResponse>(ENDPOINT, id, history);
}
/* Função para deletar um registro de histórico de status */export async function deleteTaskStatusHistory(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
