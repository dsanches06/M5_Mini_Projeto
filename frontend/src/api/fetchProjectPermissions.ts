import { get, getById, create, put, remove } from "./index.js";
import { ProjectPermissionAPIResponse } from "./dto/index.js";

const ENDPOINT = "project_permissions";
/* Função para obter a lista de permissões de projeto */export async function getProjectPermissions(sort?: string, search?: string): Promise<ProjectPermissionAPIResponse[]> {
  return get<ProjectPermissionAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma permissão de projeto por ID */
export async function getProjectPermissionById(id: number): Promise<ProjectPermissionAPIResponse | null> {
  return getById<ProjectPermissionAPIResponse>(ENDPOINT, id);
}
/* Função para criar uma nova permissão de projeto */export async function createProjectPermission(permission: Partial<ProjectPermissionAPIResponse>): Promise<ProjectPermissionAPIResponse | null> {
  return create<ProjectPermissionAPIResponse>(ENDPOINT, permission);
}
/* Função para atualizar uma permissão de projeto */export async function updateProjectPermission(id: number, permission: Partial<ProjectPermissionAPIResponse>): Promise<ProjectPermissionAPIResponse | null> {
  return put<ProjectPermissionAPIResponse>(ENDPOINT, id, permission);
}
/* Função para deletar uma permissão de projeto */export async function deleteProjectPermission(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
