import { get, getById, create, put, remove } from "./index.js";
import { TaskStatusHistoryAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_status_history";

export async function getTaskStatusHistories(sort?: string, search?: string): Promise<TaskStatusHistoryAPIResponse[]> {
  return get<TaskStatusHistoryAPIResponse>(ENDPOINT, sort, search);
}

export async function getTaskStatusHistoryById(id: number): Promise<TaskStatusHistoryAPIResponse | null> {
  return getById<TaskStatusHistoryAPIResponse>(ENDPOINT, id);
}

export async function createTaskStatusHistory(history: Partial<TaskStatusHistoryAPIResponse>): Promise<TaskStatusHistoryAPIResponse | null> {
  return create<TaskStatusHistoryAPIResponse>(ENDPOINT, history);
}

export async function updateTaskStatusHistory(id: number, history: Partial<TaskStatusHistoryAPIResponse>): Promise<TaskStatusHistoryAPIResponse | null> {
  return put<TaskStatusHistoryAPIResponse>(ENDPOINT, id, history);
}

export async function deleteTaskStatusHistory(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
