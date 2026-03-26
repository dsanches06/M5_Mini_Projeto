import { Project } from "@/projects/Project.js";
import { get, getById, create, put, remove } from "./index.js";

const ENDPOINT = "project_status";

/* Função para obter a lista de status de projeto */
export async function getProjectStatuses(
  sort?: string,
  search?: string,
): Promise<Project[]> {
  return get(ENDPOINT, sort, search);
}

/* Função para obter um status de projeto por ID */
export async function getProjectStatusById(id: number): Promise<Project | null> {
  return getById(ENDPOINT, id);
}

/* Função para criar um novo status de projeto */
export async function createProjectStatus(status: any): Promise<Project | null> {
  return create(ENDPOINT, status);
}

/* Função para atualizar um status de projeto */
export async function updateProjectStatus(
  id: number,
  status: any,
): Promise<Project | null> {
  return put(ENDPOINT, id, status);
}

/* Função para deletar um status de projeto */
export async function deleteProjectStatus(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
