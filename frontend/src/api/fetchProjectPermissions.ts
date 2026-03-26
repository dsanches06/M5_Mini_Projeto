import { get, getById, create, put, remove } from "./index.js";
import { ProjectPermissionAPIResponse } from "./dto/index.js";

const ENDPOINT = "project_permissions";

export async function getProjectPermissions(sort?: string, search?: string): Promise<ProjectPermissionAPIResponse[]> {
  return get<ProjectPermissionAPIResponse>(ENDPOINT, sort, search);
}

export async function getProjectPermissionById(id: number): Promise<ProjectPermissionAPIResponse | null> {
  return getById<ProjectPermissionAPIResponse>(ENDPOINT, id);
}

export async function createProjectPermission(permission: Partial<ProjectPermissionAPIResponse>): Promise<ProjectPermissionAPIResponse | null> {
  return create<ProjectPermissionAPIResponse>(ENDPOINT, permission);
}

export async function updateProjectPermission(id: number, permission: Partial<ProjectPermissionAPIResponse>): Promise<ProjectPermissionAPIResponse | null> {
  return put<ProjectPermissionAPIResponse>(ENDPOINT, id, permission);
}

export async function deleteProjectPermission(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
