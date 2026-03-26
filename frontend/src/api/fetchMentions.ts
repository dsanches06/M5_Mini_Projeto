import { get, getById, create, put, remove } from "./index.js";
import { MentionAPIResponse } from "./dto/index.js";

const ENDPOINT = "mentions";

export async function getMentions(sort?: string, search?: string): Promise<MentionAPIResponse[]> {
  return get<MentionAPIResponse>(ENDPOINT, sort, search);
}

export async function getMentionById(id: number): Promise<MentionAPIResponse | null> {
  return getById<MentionAPIResponse>(ENDPOINT, id);
}

export async function createMention(mention: Partial<MentionAPIResponse>): Promise<MentionAPIResponse | null> {
  return create<MentionAPIResponse>(ENDPOINT, mention);
}

export async function updateMention(id: number, mention: Partial<MentionAPIResponse>): Promise<MentionAPIResponse | null> {
  return put<MentionAPIResponse>(ENDPOINT, id, mention);
}

export async function deleteMention(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
