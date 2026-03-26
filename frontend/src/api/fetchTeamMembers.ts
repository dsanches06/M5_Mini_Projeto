import { get, getById, create, put, remove } from "./index.js";
import { TeamMemberAPIResponse } from "./dto/index.js";

const ENDPOINT = "team_members";

export async function getTeamMembers(sort?: string, search?: string): Promise<TeamMemberAPIResponse[]> {
  return get<TeamMemberAPIResponse>(ENDPOINT, sort, search);
}

export async function getTeamMemberById(id: number): Promise<TeamMemberAPIResponse | null> {
  return getById<TeamMemberAPIResponse>(ENDPOINT, id);
}

export async function createTeamMember(member: Partial<TeamMemberAPIResponse>): Promise<TeamMemberAPIResponse | null> {
  return create<TeamMemberAPIResponse>(ENDPOINT, member);
}

export async function updateTeamMember(id: number, member: Partial<TeamMemberAPIResponse>): Promise<TeamMemberAPIResponse | null> {
  return put<TeamMemberAPIResponse>(ENDPOINT, id, member);
}

export async function deleteTeamMember(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
