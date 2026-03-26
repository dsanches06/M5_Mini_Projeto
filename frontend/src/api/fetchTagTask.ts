import { get, getById, create, put, remove } from "./index.js";
import { TagTaskAPIResponse } from "./dto/index.js";

const ENDPOINT = "tags_task";

export async function getTagTasks(sort?: string, search?: string): Promise<TagTaskAPIResponse[]> {
  return get<TagTaskAPIResponse>(ENDPOINT, sort, search);
}

export async function getTagTaskById(id: number): Promise<TagTaskAPIResponse | null> {
  return getById<TagTaskAPIResponse>(ENDPOINT, id);
}

export async function createTagTask(tagTask: Partial<TagTaskAPIResponse>): Promise<TagTaskAPIResponse | null> {
  return create<TagTaskAPIResponse>(ENDPOINT, tagTask);
}

export async function updateTagTask(id: number, tagTask: Partial<TagTaskAPIResponse>): Promise<TagTaskAPIResponse | null> {
  return put<TagTaskAPIResponse>(ENDPOINT, id, tagTask);
}

export async function deleteTagTask(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
