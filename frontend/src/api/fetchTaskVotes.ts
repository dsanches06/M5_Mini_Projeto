import { get, getById, create, put, remove } from "./index.js";
import { TaskVoteAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_votes";

export async function getTaskVotes(sort?: string, search?: string): Promise<TaskVoteAPIResponse[]> {
  return get<TaskVoteAPIResponse>(ENDPOINT, sort, search);
}

export async function getTaskVoteById(id: number): Promise<TaskVoteAPIResponse | null> {
  return getById<TaskVoteAPIResponse>(ENDPOINT, id);
}

export async function createTaskVote(vote: Partial<TaskVoteAPIResponse>): Promise<TaskVoteAPIResponse | null> {
  return create<TaskVoteAPIResponse>(ENDPOINT, vote);
}

export async function updateTaskVote(id: number, vote: Partial<TaskVoteAPIResponse>): Promise<TaskVoteAPIResponse | null> {
  return put<TaskVoteAPIResponse>(ENDPOINT, id, vote);
}

export async function deleteTaskVote(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
