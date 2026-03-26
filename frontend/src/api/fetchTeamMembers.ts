import { get, getById, create, put, remove } from "./index.js";
import { TeamMemberAPIResponse } from "./dto/index.js";

const ENDPOINT = "team_members";

/* Função para obter a lista de membros de equipe */
export async function getTeamMembers(
  sort?: string,
  search?: string,
): Promise<TeamMemberAPIResponse[]> {
  return get<TeamMemberAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um membro de equipe por ID */
export async function getTeamMemberById(
  id: number,
): Promise<TeamMemberAPIResponse | null> {
  return getById<TeamMemberAPIResponse>(ENDPOINT, id);
}

/* Função para criar um novo membro de equipe */
export async function createTeamMember(
  member: Partial<TeamMemberAPIResponse>,
): Promise<TeamMemberAPIResponse | null> {
  return create<TeamMemberAPIResponse>(ENDPOINT, member);
}

/* Função para atualizar um membro de equipe */
export async function updateTeamMember(
  id: number,
  member: Partial<TeamMemberAPIResponse>,
): Promise<TeamMemberAPIResponse | null> {
  return put<TeamMemberAPIResponse>(ENDPOINT, id, member);
}

/* Função para deletar um membro de equipe */
export async function deleteTeamMember(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
