import { get, getById, create, put, remove } from "./index.js";
import { FavoriteTaskAPIResponse } from "./dto/index.js";

const ENDPOINT = "favorite_tasks";

/* Função para obter a lista de tarefas favoritas */
export async function getFavoriteTasks(
  sort?: string,
  search?: string,
): Promise<FavoriteTaskAPIResponse[]> {
  return get<FavoriteTaskAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma tarefa favorita por ID */
export async function getFavoriteTaskById(
  id: number,
): Promise<FavoriteTaskAPIResponse | null> {
  return getById<FavoriteTaskAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova tarefa favorita */
export async function createFavoriteTask(
  favoriteTask: Partial<FavoriteTaskAPIResponse>,
): Promise<FavoriteTaskAPIResponse | null> {
  return create<FavoriteTaskAPIResponse>(ENDPOINT, favoriteTask);
}

/* Função para atualizar uma tarefa favorita */
export async function updateFavoriteTask(
  id: number,
  favoriteTask: Partial<FavoriteTaskAPIResponse>,
): Promise<FavoriteTaskAPIResponse | null> {
  return put<FavoriteTaskAPIResponse>(ENDPOINT, id, favoriteTask);
}

/* Função para deletar uma tarefa favorita */
export async function deleteFavoriteTask(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
