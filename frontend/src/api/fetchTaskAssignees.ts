import { get, getById, create, put, remove } from "./index.js";
import { TaskAssigneeAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_assignees";

export async function getTaskAssignees(sort?: string, search?: string): Promise<TaskAssigneeAPIResponse[]> {
  return get<TaskAssigneeAPIResponse>(ENDPOINT, sort, search);
}

export async function getTaskAssigneeById(id: number): Promise<TaskAssigneeAPIResponse | null> {
  return getById<TaskAssigneeAPIResponse>(ENDPOINT, id);
}

export async function createTaskAssignee(assignee: Partial<TaskAssigneeAPIResponse>): Promise<TaskAssigneeAPIResponse | null> {
  return create<TaskAssigneeAPIResponse>(ENDPOINT, assignee);
}

export async function updateTaskAssignee(id: number, assignee: Partial<TaskAssigneeAPIResponse>): Promise<TaskAssigneeAPIResponse | null> {
  return put<TaskAssigneeAPIResponse>(ENDPOINT, id, assignee);
}

export async function deleteTaskAssignee(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
