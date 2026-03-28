import { SprintAPIResponse } from "@api/dto/typesDTO.js";
import * as fetchSprints from "../api/fetchSprints.js";

/* Serviço para gerenciar sprints */
export class SprintService {
  /* Função para obter a lista de sprints */
  static async getSprints(
    sort?: string,
    search?: string,
  ): Promise<SprintAPIResponse[]> {
    return await fetchSprints.getSprints(sort, search);
  }

  /* Função para obter um sprint por ID */
  static async getSprintById(id: number): Promise<SprintAPIResponse | null> {
    return await fetchSprints.getSprintById(id);
  }

  /* Função para criar um novo sprint */
  static async createSprint(sprint: any): Promise<SprintAPIResponse | null> {
    return await fetchSprints.createSprint(sprint);
  }

  /* Função para atualizar um sprint existente */
  static async updateSprint(id: number, sprint: any): Promise<SprintAPIResponse | null> {
    return await fetchSprints.updateSprint(id, sprint);
  }

  /* Função para excluir um sprint */
  static async deleteSprint(id: number): Promise<boolean> {
    return await fetchSprints.deleteSprint(id);
  }
}
