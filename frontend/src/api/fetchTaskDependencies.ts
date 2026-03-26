import { get, getById, create, put, remove } from "./index.js";
import { TaskDependencyAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_dependencies";

export async function getTaskDependencies(sort?: string, search?: string): Promise<TaskDependencyAPIResponse[]> {
  return get<TaskDependencyAPIResponse>(ENDPOINT, sort, search);
}

export async function getTaskDependencyById(id: number): Promise<TaskDependencyAPIResponse | null> {
  return getById<TaskDependencyAPIResponse>(ENDPOINT, id);
}

export async function createTaskDependency(dependency: Partial<TaskDependencyAPIResponse>): Promise<TaskDependencyAPIResponse | null> {
  return create<TaskDependencyAPIResponse>(ENDPOINT, dependency);
}

export async function updateTaskDependency(id: number, dependency: Partial<TaskDependencyAPIResponse>): Promise<TaskDependencyAPIResponse | null> {
  return put<TaskDependencyAPIResponse>(ENDPOINT, id, dependency);
}

export async function deleteTaskDependency(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
