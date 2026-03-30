import * as fetchTeamMembers from "../api/fetchTeamMembers.js";

/* Serviço para gerenciar membros de equipe */
export class TeamMemberService {
  /* Função para obter a lista de membros de equipe */
  static async getTeamMembers(): Promise<any[]> {
    return await fetchTeamMembers.getTeamMembers();
  }

  /* Função para obter um membro de equipe por ID */
  static async getTeamMemberById(id: number): Promise<any | null> {
    return await fetchTeamMembers.getTeamMemberById(id);
  }

  /* Função para criar um novo membro de equipe */
  static async createTeamMember(member: any): Promise<any | null> {
    return await fetchTeamMembers.createTeamMember(member);
  }

  /* Função para atualizar um membro de equipe existente */
  static async updateTeamMember(id: number, member: any): Promise<any | null> {
    return await fetchTeamMembers.updateTeamMember(id, member);
  }

  /* Função para excluir um membro de equipe */
  static async deleteTeamMember(id: number): Promise<boolean> {
    return await fetchTeamMembers.deleteTeamMember(id);
  }
}
