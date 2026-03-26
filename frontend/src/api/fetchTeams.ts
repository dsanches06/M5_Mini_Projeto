import { get, getById, create, put, remove } from "./index.js";
import { TeamAPIResponse } from "./dto/index.js";

const ENDPOINT = "teams";

export async function getTeams(sort?: string, search?: string): Promise<TeamAPIResponse[]> {
  return get<TeamAPIResponse>(ENDPOINT, sort, search);
}

export async function getTeamById(id: number): Promise<TeamAPIResponse | null> {
  return getById<TeamAPIResponse>(ENDPOINT, id);
}

export async function createTeam(team: Partial<TeamAPIResponse>): Promise<TeamAPIResponse | null> {
  return create<TeamAPIResponse>(ENDPOINT, team);
}

export async function updateTeam(id: number, team: Partial<TeamAPIResponse>): Promise<TeamAPIResponse | null> {
  return put<TeamAPIResponse>(ENDPOINT, id, team);
}

export async function deleteTeam(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
