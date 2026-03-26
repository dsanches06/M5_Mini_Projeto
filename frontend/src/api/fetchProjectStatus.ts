import { Project } from "@/projects/Project.js";
import { get, getById, create, put, remove } from "./index.js";

const ENDPOINT = "project_status";

export async function getProjectStatuses(
  sort?: string,
  search?: string,
): Promise<Project[]> {
  return get(ENDPOINT, sort, search);
}

export async function getProjectStatusById(id: number): Promise<Project | null> {
  return getById(ENDPOINT, id);
}

export async function createProjectStatus(status: any): Promise<Project | null> {
  return create(ENDPOINT, status);
}

export async function updateProjectStatus(
  id: number,
  status: any,
): Promise<Project | null> {
  return put(ENDPOINT, id, status);
}

export async function deleteProjectStatus(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
