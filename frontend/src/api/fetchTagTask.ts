import { get, getById, create, put, remove } from "./index.js";
import { TagTaskAPIResponse } from "./dto/index.js";

const ENDPOINT = "tags_task";
/* Função para obter a lista de relações de tags em tarefas */export async function getTagTasks(sort?: string, search?: string): Promise<TagTaskAPIResponse[]> {
  return get<TagTaskAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma relação de tag em tarefa por ID */
export async function getTagTaskById(id: number): Promise<TagTaskAPIResponse | null> {
  return getById<TagTaskAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova relação de tag em tarefa */
export async function createTagTask(tagTask: Partial<TagTaskAPIResponse>): Promise<TagTaskAPIResponse | null> {
  return create<TagTaskAPIResponse>(ENDPOINT, tagTask);
}

/* Função para atualizar uma relação de tag em tarefa */
export async function updateTagTask(id: number, tagTask: Partial<TagTaskAPIResponse>): Promise<TagTaskAPIResponse | null> {
  return put<TagTaskAPIResponse>(ENDPOINT, id, tagTask);
}

/* Função para deletar uma relação de tag em tarefa */
export async function deleteTagTask(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
