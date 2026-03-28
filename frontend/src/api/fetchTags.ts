import { get, getById, create, put, remove } from "./index.js";
import { BASE_URL } from "./utils/index.js";
import { TaskAPIResponse, TagAPIResponse } from "./dto/index.js";

const ENDPOINT = "tags";

/* Função para obter a lista de tags */
export async function getTags(
  sort?: string,
  search?: string,
): Promise<TagAPIResponse[]> {
  return get<TagAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma tag por ID */
export async function getTagById(id: number): Promise<TagAPIResponse | null> {
  return getById<TagAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova tag */
export async function createTag(
  tag: Partial<TagAPIResponse>,
): Promise<TagAPIResponse | null> {
  return create<TagAPIResponse>(ENDPOINT, tag);
}

/* Função para atualizar uma tag */
export async function updateTag(
  id: number,
  tag: Partial<TagAPIResponse>,
): Promise<TagAPIResponse | null> {
  return put<TagAPIResponse>(ENDPOINT, id, tag);
}

/* Função para deletar uma tag */
export async function deleteTag(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}

export async function getTasksByTag(tagId: number): Promise<TaskAPIResponse[]> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${tagId}/tasks`);
    if (!res.ok) {
      throw new Error(`ERRO: Não foi possível obter tarefas da tag ${tagId} - ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter tarefas da tag:", error);
    return [];
  }
}
