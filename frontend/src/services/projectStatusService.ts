import { ProjectStatusAPIResponse } from "../api/dto/index.js";
import * as fetchProjectStatus from "../api/fetchProjectStatus.js";

/* Serviço para gerenciar status de projetos */
export class ProjectStatusService {
  
  /* Função para obter a lista de status de projetos */
  static async getProjectStatuses(): Promise<ProjectStatusAPIResponse[]> {
    return await fetchProjectStatus.getProjectStatuses();
  }

  /* Função para obter um status de projeto por ID */
  static async getProjectStatusById(id: number): Promise<ProjectStatusAPIResponse | null> {
    return await fetchProjectStatus.getProjectStatusById(id);
  }

  /* Função para criar um novo status de projeto */
  static async createProjectStatus(status: any): Promise<ProjectStatusAPIResponse | null> {
    return await fetchProjectStatus.createProjectStatus(status);
  }

  /* Função para atualizar um status de projeto existente */
  static async updateProjectStatus(id: number, status: any): Promise<ProjectStatusAPIResponse | null> {
    return await fetchProjectStatus.updateProjectStatus(id, status);
  }

  /* Função para excluir um status de projeto */
  static async deleteProjectStatus(id: number): Promise<boolean> {
    return await fetchProjectStatus.deleteProjectStatus(id);
  }
}
