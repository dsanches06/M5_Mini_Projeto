import { get, getById, create, put, remove } from "./index.js";
import { TaskVoteAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_votes";
/* Função para obter a lista de votos de tarefas */export async function getTaskVotes(sort?: string, search?: string): Promise<TaskVoteAPIResponse[]> {
  return get<TaskVoteAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um voto de tarefa por ID */
export async function getTaskVoteById(id: number): Promise<TaskVoteAPIResponse | null> {
  return getById<TaskVoteAPIResponse>(ENDPOINT, id);
}
/* Função para criar um novo voto de tarefa */export async function createTaskVote(vote: Partial<TaskVoteAPIResponse>): Promise<TaskVoteAPIResponse | null> {
  return create<TaskVoteAPIResponse>(ENDPOINT, vote);
}
/* Função para atualizar um voto de tarefa */export async function updateTaskVote(id: number, vote: Partial<TaskVoteAPIResponse>): Promise<TaskVoteAPIResponse | null> {
  return put<TaskVoteAPIResponse>(ENDPOINT, id, vote);
}
/* Função para deletar um voto de tarefa */export async function deleteTaskVote(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
