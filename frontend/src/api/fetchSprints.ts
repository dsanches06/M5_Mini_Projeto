import { get, getById, create, put, remove } from "./index.js";
import { SprintAPIResponse } from "./dto/index.js";

const ENDPOINT = "sprints";

export async function getSprints(sort?: string, search?: string): Promise<SprintAPIResponse[]> {
  return get<SprintAPIResponse>(ENDPOINT, sort, search);
}

export async function getSprintById(id: number): Promise<SprintAPIResponse | null> {
  return getById<SprintAPIResponse>(ENDPOINT, id);
}

export async function createSprint(sprint: Partial<SprintAPIResponse>): Promise<SprintAPIResponse | null> {
  return create<SprintAPIResponse>(ENDPOINT, sprint);
}

export async function updateSprint(id: number, sprint: Partial<SprintAPIResponse>): Promise<SprintAPIResponse | null> {
  return put<SprintAPIResponse>(ENDPOINT, id, sprint);
}

export async function deleteSprint(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
