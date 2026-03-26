import { get, getById, create, put, remove } from "./index.js";
import { FavoriteTaskAPIResponse } from "./dto/index.js";

const ENDPOINT = "favorite_tasks";

export async function getFavoriteTasks(sort?: string, search?: string): Promise<FavoriteTaskAPIResponse[]> {
  return get<FavoriteTaskAPIResponse>(ENDPOINT, sort, search);
}

export async function getFavoriteTaskById(id: number): Promise<FavoriteTaskAPIResponse | null> {
  return getById<FavoriteTaskAPIResponse>(ENDPOINT, id);
}

export async function createFavoriteTask(favoriteTask: Partial<FavoriteTaskAPIResponse>): Promise<FavoriteTaskAPIResponse | null> {
  return create<FavoriteTaskAPIResponse>(ENDPOINT, favoriteTask);
}

export async function updateFavoriteTask(id: number, favoriteTask: Partial<FavoriteTaskAPIResponse>): Promise<FavoriteTaskAPIResponse | null> {
  return put<FavoriteTaskAPIResponse>(ENDPOINT, id, favoriteTask);
}

export async function deleteFavoriteTask(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
