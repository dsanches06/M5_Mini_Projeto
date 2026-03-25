import * as fetchSprints from "../api/fetchSprints.js";

/* Serviço para gerenciar sprints */
export class SprintService {
  /* Função para obter a lista de sprints */
  static async getSprints(
    sort?: string,
    search?: string,
  ): Promise<any[]> {
    return await fetchSprints.getSprints(sort, search);
  }

  /* Função para obter um sprint por ID */
  static async getSprintById(id: number): Promise<any | null> {
    return await fetchSprints.getSprintById(id);
  }

  /* Função para criar um novo sprint */
  static async createSprint(sprint: any): Promise<any | null> {
    return await fetchSprints.createSprint(sprint);
  }

  /* Função para atualizar um sprint existente */
  static async updateSprint(id: number, sprint: any): Promise<any | null> {
    return await fetchSprints.updateSprint(id, sprint);
  }

  /* Função para excluir um sprint */
  static async deleteSprint(id: number): Promise<boolean> {
    return await fetchSprints.deleteSprint(id);
  }
}
