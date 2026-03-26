import { get, getById, create, put, remove } from "./index.js";
import { MentionAPIResponse } from "./dto/index.js";

const ENDPOINT = "mentions";

/* Função para obter a lista de menções */
export async function getMentions(
  sort?: string,
  search?: string,
): Promise<MentionAPIResponse[]> {
  return get<MentionAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma menção por ID */
export async function getMentionById(
  id: number,
): Promise<MentionAPIResponse | null> {
  return getById<MentionAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova menção */
export async function createMention(
  mention: Partial<MentionAPIResponse>,
): Promise<MentionAPIResponse | null> {
  return create<MentionAPIResponse>(ENDPOINT, mention);
}

/* Função para atualizar uma menção */
export async function updateMention(
  id: number,
  mention: Partial<MentionAPIResponse>,
): Promise<MentionAPIResponse | null> {
  return put<MentionAPIResponse>(ENDPOINT, id, mention);
}

/* Função para deletar uma menção */
export async function deleteMention(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
