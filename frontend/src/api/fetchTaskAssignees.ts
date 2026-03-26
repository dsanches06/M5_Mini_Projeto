import { get, getById, create, put, remove } from "./index.js";
import { TaskAssigneeAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_assignees";

/* Função para obter a lista de atribuíções de tarefas */
export async function getTaskAssignees(
  sort?: string,
  search?: string,
): Promise<TaskAssigneeAPIResponse[]> {
  return get<TaskAssigneeAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma atribuição de tarefa por ID */
export async function getTaskAssigneeById(
  id: number,
): Promise<TaskAssigneeAPIResponse | null> {
  return getById<TaskAssigneeAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova atribuição de tarefa */
export async function createTaskAssignee(
  assignee: Partial<TaskAssigneeAPIResponse>,
): Promise<TaskAssigneeAPIResponse | null> {
  return create<TaskAssigneeAPIResponse>(ENDPOINT, assignee);
}

/* Função para atualizar uma atribuição de tarefa */
export async function updateTaskAssignee(
  id: number,
  assignee: Partial<TaskAssigneeAPIResponse>,
): Promise<TaskAssigneeAPIResponse | null> {
  return put<TaskAssigneeAPIResponse>(ENDPOINT, id, assignee);
}

/* Função para deletar uma atribuição de tarefa */
export async function deleteTaskAssignee(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
