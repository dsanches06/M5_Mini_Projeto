import * as fetchProjects from "../api/fetchProjects.js";
import * as fetchProjectStatus from "../api/fetchProjectStatus.js";
import { IProject, Project } from "../projects/index.js";
import { ProjectStatusAPIResponse } from "../api/dto/index.js";

/* Serviço para gerenciar projetos */
export class ProjectService {
  /* Função para obter a lista de projetos */
  static async getProjects(
    sort?: string,
    search?: string,
  ): Promise<Project[]> {
    return await fetchProjects.getProjects(sort, search);
  }

  /* Função para obter um projeto por ID */
  static async getProjectById(id: number): Promise<Project | null> {
    return await fetchProjects.getProjectById(id);
  }

  /* Função para criar um novo projeto */
  static async createProject(project: Project): Promise<Project | null> {
    return await fetchProjects.createProject(project);
  }

  /* Função para atualizar um projeto existente */
  static async updateProject(project: Project): Promise<Project | null> {
    return await fetchProjects.updateProject(project);
  }

  /* Função para excluir um projeto */
  static async deleteProject(id: number): Promise<boolean> {
    return await fetchProjects.deleteProject(id);
  }

  /* Função para obter os status disponíveis dos projetos */
  static async getProjectStatuses(): Promise<ProjectStatusAPIResponse[]> {
    return await fetchProjectStatus.getProjectStatuses();
  }
}
