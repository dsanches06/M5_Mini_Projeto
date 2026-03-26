import { get, getById, create, put, remove } from "./index.js";
import { Project } from "../projects/index.js";
import { mapToProject, ProjectAPIResponse } from "./dto/index.js";

const ENDPOINT = "projects";

/* Função para obter a lista de projetos */
export async function getProjects(
  sort?: string,
  search?: string,
): Promise<Project[]> {
  const data = await get<ProjectAPIResponse>(ENDPOINT, sort, search);
  return data.map((item: any) => mapToProject(item));
}

/* Função para obter um projeto específico por ID */
export async function getProjectById(id: number): Promise<Project | null> {
  const data = await getById<ProjectAPIResponse>(ENDPOINT, id);
  return data ? mapToProject(data) : null;
}

/* Função para criar um novo projeto */
export async function createProject(project: Project): Promise<Project | null> {
  const data = await create<ProjectAPIResponse>(ENDPOINT, project);
  return data ? mapToProject(data) : null;
}

/* Função para atualizar um projeto existente */
export async function updateProject(project: Project): Promise<Project | null> {
  const data = await put<ProjectAPIResponse>(
    ENDPOINT,
    project.getId(),
    project as Project,
  );
  return data ? mapToProject(data) : null;
}

/* Função para excluir um projeto por ID */
export async function deleteProject(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
