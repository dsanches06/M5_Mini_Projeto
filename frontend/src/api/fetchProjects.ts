import { BASE_URL } from "./constants.js";
import { Project } from "../projects/index.js";

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
  try {
    let url = `${BASE_URL}projects`;
    const params: string[] = [];

    if (sort) {
      params.push(`sort=${encodeURIComponent(sort)}`);
    }
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter projetos " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data.map((item) => mapToProject(item));
  } catch (error) {
    console.error("Erro ao obter projetos:", error);
    return [];
  }
}

/* Função para obter um projeto específico por ID */
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const res = await fetch(`${BASE_URL}projects/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    // Converter dados da API para instância de Project
    return mapToProject(data);
  } catch (error) {
    console.error(`Erro ao obter o projeto com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo projeto */
export async function createProject(project: Project): Promise<Project | null> {
  try {
    const res = await fetch(`${BASE_URL}projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return mapToProject(data);
  } catch (error) {
    console.error("Erro ao criar o projeto:", error);
    return null;
  }
}

/* Função para atualizar um projeto existente */
export async function updateProject(project: Project): Promise<Project | null> {
  try {
    const res = await fetch(`${BASE_URL}projects/${project.getId()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project as Project),
    });
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível atualizar o projeto " + res.status,
      );
    }
    const data: any = await res.json();
    console.table(data);
    return mapToProject(data);
  } catch (error) {
    console.error("Erro ao atualizar o projeto:", error);
    return null;
  }
}

/* Função para excluir um projeto por ID */
export async function deleteProject(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}projects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o projeto " + res.status);
    }
    console.log(`Projeto com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o projeto com ID ${id}:`, error);
    return false;
  }
}
