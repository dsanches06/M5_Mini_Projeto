import { get, getById, create, put, remove } from "./index.js";
import { TaskStatusAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_status";

//usar um type específico para TaskStatus em vez de any


export async function getTaskStatuses(sort?: string, search?: string): Promise<TaskStatusAPIResponse[]> {
  return get<TaskStatusAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um status de tarefa por ID */
export async function getTaskStatusById(id: number): Promise<TaskStatusAPIResponse | null> {
  return getById<TaskStatusAPIResponse>(ENDPOINT, id);
}
/* Função para criar um novo status de tarefa */export async function createTaskStatus(status: Partial<TaskStatusAPIResponse>): Promise<TaskStatusAPIResponse | null> {
  return create<TaskStatusAPIResponse>(ENDPOINT, status);
}
/* Função para atualizar um status de tarefa */export async function updateTaskStatus(id: number, status: Partial<TaskStatusAPIResponse>): Promise<TaskStatusAPIResponse | null> {
  return put<TaskStatusAPIResponse>(ENDPOINT, id, status);
}
/* Função para deletar um status de tarefa */export async function deleteTaskStatus(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
