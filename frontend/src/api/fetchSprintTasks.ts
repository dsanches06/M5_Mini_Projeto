import { get, getById, create, put, remove } from "./index.js";
import { SprintTaskAPIResponse } from "./dto/index.js";

const ENDPOINT = "sprint_tasks";
/* Função para obter a lista de tarefas de sprint */export async function getSprintTasks(sort?: string, search?: string): Promise<SprintTaskAPIResponse[]> {
  return get<SprintTaskAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma tarefa de sprint por ID */
export async function getSprintTaskById(id: number): Promise<SprintTaskAPIResponse | null> {
  return getById<SprintTaskAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova tarefa de sprint */
export async function createSprintTask(sprintTask: Partial<SprintTaskAPIResponse>): Promise<SprintTaskAPIResponse | null> {
  return create<SprintTaskAPIResponse>(ENDPOINT, sprintTask);
}

/* Função para atualizar uma tarefa de sprint */
export async function updateSprintTask(id: number, sprintTask: Partial<SprintTaskAPIResponse>): Promise<SprintTaskAPIResponse | null> {
  return put<SprintTaskAPIResponse>(ENDPOINT, id, sprintTask);
}

/* Função para deletar uma tarefa de sprint */
export async function deleteSprintTask(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
