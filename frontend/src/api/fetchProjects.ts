import { get, getById, create, put, remove } from "./index.js";
import { Project } from "../projects/index.js";

const ENDPOINT = "projects";

/* Função auxiliar para converter data seguramente */
function parseDate(date: any): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === "string") {
    return new Date(date);
  }
  return new Date();
}

/* Função auxiliar para mapear dados da API para instâncias de Project */
function mapToProject(data: any): Project {
  return new Project(
    data.id,
    data.name,
    data.description,
    data.projectStatusId,
    parseDate(data.startDate),
    parseDate(data.endDateExpected),
  );
}

/* Função para obter a lista de projetos */
export async function getProjects(
  sort?: string,
  search?: string,
): Promise<Project[]> {
  const data = await get(ENDPOINT, sort, search);
  return data.map((item: any) => mapToProject(item));
}

/* Função para obter um projeto específico por ID */
export async function getProjectById(id: number): Promise<Project | null> {
  const data = await getById(ENDPOINT, id);
  return data ? mapToProject(data) : null;
}

/* Função para criar um novo projeto */
export async function createProject(project: Project): Promise<Project | null> {
  const data = await create(ENDPOINT, project);
  return data ? mapToProject(data) : null;
}

/* Função para atualizar um projeto existente */
export async function updateProject(project: Project): Promise<Project | null> {
  const data = await put(ENDPOINT, project.getId(), project as Project);
  return data ? mapToProject(data) : null;
}

/* Função para excluir um projeto por ID */
export async function deleteProject(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
