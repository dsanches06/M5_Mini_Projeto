import { get, getById, create, put, remove } from "./index.js";
import { TaskDependencyAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_dependencies";

/* Função para obter a lista de dependências de tarefas */
export async function getTaskDependencies(
  sort?: string,
  search?: string,
): Promise<TaskDependencyAPIResponse[]> {
  return get<TaskDependencyAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma dependência de tarefa por ID */
export async function getTaskDependencyById(
  id: number,
): Promise<TaskDependencyAPIResponse | null> {
  return getById<TaskDependencyAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova dependência de tarefa */
export async function createTaskDependency(
  dependency: Partial<TaskDependencyAPIResponse>,
): Promise<TaskDependencyAPIResponse | null> {
  return create<TaskDependencyAPIResponse>(ENDPOINT, dependency);
}

/* Função para atualizar uma dependência de tarefa */
export async function updateTaskDependency(
  id: number,
  dependency: Partial<TaskDependencyAPIResponse>,
): Promise<TaskDependencyAPIResponse | null> {
  return put<TaskDependencyAPIResponse>(ENDPOINT, id, dependency);
}

/* Função para deletar uma dependência de tarefa */
export async function deleteTaskDependency(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
