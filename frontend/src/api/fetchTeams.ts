import { get, getById, create, put, remove } from "./index.js";
import { TeamAPIResponse } from "./dto/index.js";

const ENDPOINT = "teams";

/* Função para obter a lista de equipes */
export async function getTeams(sort?: string, search?: string): Promise<TeamAPIResponse[]> {
  return get<TeamAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma equipe por ID */
export async function getTeamById(id: number): Promise<TeamAPIResponse | null> {
  return getById<TeamAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova equipe */
export async function createTeam(team: Partial<TeamAPIResponse>): Promise<TeamAPIResponse | null> {
  return create<TeamAPIResponse>(ENDPOINT, team);
}

/* Função para atualizar uma equipe */
export async function updateTeam(id: number, team: Partial<TeamAPIResponse>): Promise<TeamAPIResponse | null> {
  return put<TeamAPIResponse>(ENDPOINT, id, team);
}

/* Função para deletar uma equipe */
export async function deleteTeam(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
