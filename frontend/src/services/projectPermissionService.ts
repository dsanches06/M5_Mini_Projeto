import { ProjectPermissionAPIResponse } from "@api/dto/typesDTO.js";
import * as fetchProjectPermissions from "../api/fetchProjectPermissions.js";

/* Serviço para gerenciar permissões de projeto */
export class ProjectPermissionService {
  /* Função para obter a lista de permissões de projeto */
  static async getProjectPermissions(): Promise<ProjectPermissionAPIResponse[]> {
    return await fetchProjectPermissions.getProjectPermissions();
  }

  /* Função para obter uma permissão de projeto por ID */
  static async getProjectPermissionById(id: number): Promise<ProjectPermissionAPIResponse | null> {
    return await fetchProjectPermissions.getProjectPermissionById(id);
  }

  /* Função para criar uma nova permissão de projeto */
  static async createProjectPermission(permission: any): Promise<ProjectPermissionAPIResponse | null> {
    return await fetchProjectPermissions.createProjectPermission(permission);
  }

  /* Função para atualizar uma permissão de projeto existente */
  static async updateProjectPermission(id: number, permission: any): Promise<ProjectPermissionAPIResponse | null> {
    return await fetchProjectPermissions.updateProjectPermission(id, permission);
  }

  /* Função para excluir uma permissão de projeto */
  static async deleteProjectPermission(id: number): Promise<boolean> {
    return await fetchProjectPermissions.deleteProjectPermission(id);
  }
}
