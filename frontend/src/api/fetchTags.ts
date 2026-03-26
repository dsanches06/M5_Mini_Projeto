import { get, getById, create, put, remove } from "./index.js";
import { TagAPIResponse } from "./dto/index.js";

const ENDPOINT = "tags";

export async function getTags(sort?: string, search?: string): Promise<TagAPIResponse[]> {
  return get<TagAPIResponse>(ENDPOINT, sort, search);
}

export async function getTagById(id: number): Promise<TagAPIResponse | null> {
  return getById<TagAPIResponse>(ENDPOINT, id);
}

export async function createTag(tag: Partial<TagAPIResponse>): Promise<TagAPIResponse | null> {
  return create<TagAPIResponse>(ENDPOINT, tag);
}

export async function updateTag(id: number, tag: Partial<TagAPIResponse>): Promise<TagAPIResponse | null> {
  return put<TagAPIResponse>(ENDPOINT, id, tag);
}

export async function deleteTag(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
