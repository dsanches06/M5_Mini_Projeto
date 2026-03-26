import { get, getById, create, put, remove } from "./index.js";
import { ProjectStatusAPIResponse } from "./dto/index.js";

const ENDPOINT = "project_status";

/* Função para obter a lista de status de projeto */
export async function getProjectStatuses(
  sort?: string,
  search?: string,
): Promise<ProjectStatusAPIResponse[]> {
  return get<ProjectStatusAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um status de projeto por ID */
export async function getProjectStatusById(
  id: number,
): Promise<ProjectStatusAPIResponse | null> {
  return getById<ProjectStatusAPIResponse>(ENDPOINT, id);
}

/* Função para criar um novo status de projeto */
export async function createProjectStatus(
  status: Partial<ProjectStatusAPIResponse>,
): Promise<ProjectStatusAPIResponse | null> {
  return create<ProjectStatusAPIResponse>(ENDPOINT, status);
}

/* Função para atualizar um status de projeto */
export async function updateProjectStatus(
  id: number,
  status: Partial<ProjectStatusAPIResponse>,
): Promise<ProjectStatusAPIResponse | null> {
  return put<ProjectStatusAPIResponse>(ENDPOINT, id, status);
}

/* Função para deletar um status de projeto */
export async function deleteProjectStatus(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
