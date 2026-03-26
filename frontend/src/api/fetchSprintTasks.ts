import { get, getById, create, put, remove } from "./index.js";
import { SprintTaskAPIResponse } from "./dto/index.js";

const ENDPOINT = "sprint_tasks";

export async function getSprintTasks(sort?: string, search?: string): Promise<SprintTaskAPIResponse[]> {
  return get<SprintTaskAPIResponse>(ENDPOINT, sort, search);
}

export async function getSprintTaskById(id: number): Promise<SprintTaskAPIResponse | null> {
  return getById<SprintTaskAPIResponse>(ENDPOINT, id);
}

export async function createSprintTask(sprintTask: Partial<SprintTaskAPIResponse>): Promise<SprintTaskAPIResponse | null> {
  return create<SprintTaskAPIResponse>(ENDPOINT, sprintTask);
}

export async function updateSprintTask(id: number, sprintTask: Partial<SprintTaskAPIResponse>): Promise<SprintTaskAPIResponse | null> {
  return put<SprintTaskAPIResponse>(ENDPOINT, id, sprintTask);
}

export async function deleteSprintTask(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
