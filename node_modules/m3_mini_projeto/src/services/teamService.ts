import * as fetchTeams from "../api/fetchTeams.js";

/* Serviço para gerenciar equipes */
export class TeamService {
  /* Função para obter a lista de equipes */
  static async getTeams(): Promise<any[]> {
    return await fetchTeams.getTeams();
  }

  /* Função para obter uma equipe por ID */
  static async getTeamById(id: number): Promise<any | null> {
    return await fetchTeams.getTeamById(id);
  }

  /* Função para criar uma nova equipe */
  static async createTeam(team: any): Promise<any | null> {
    return await fetchTeams.createTeam(team);
  }

  /* Função para atualizar uma equipe existente */
  static async updateTeam(id: number, team: any): Promise<any | null> {
    return await fetchTeams.updateTeam(id, team);
  }

  /* Função para excluir uma equipe */
  static async deleteTeam(id: number): Promise<boolean> {
    return await fetchTeams.deleteTeam(id);
  }
}
