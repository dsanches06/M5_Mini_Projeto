import { get, getById, create, put, remove } from "./index.js";
import { PriorityAPIResponse } from "./dto/index.js";

const ENDPOINT = "priorities";

export async function getPriorities(
  sort?: string,
  search?: string,
): Promise<PriorityAPIResponse[]> {
  return get<PriorityAPIResponse>(ENDPOINT, sort, search);
}

export async function getPriorityById(
  id: number,
): Promise<PriorityAPIResponse | null> {
  return getById<PriorityAPIResponse>(ENDPOINT, id);
}

export async function createPriority(
  priority: Partial<PriorityAPIResponse>,
): Promise<PriorityAPIResponse | null> {
  return create<PriorityAPIResponse>(ENDPOINT, priority);
}

export async function updatePriority(
  id: number,
  priority: Partial<PriorityAPIResponse>,
): Promise<PriorityAPIResponse | null> {
  return put<PriorityAPIResponse>(ENDPOINT, id, priority);
}

/* Função para deletar uma prioridade */
export async function deletePriority(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
