import { get, getById, create, put, remove } from "./index.js";
import { TaskAttachmentAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_attachments";

export async function getTaskAttachments(sort?: string, search?: string): Promise<TaskAttachmentAPIResponse[]> {
  return get<TaskAttachmentAPIResponse>(ENDPOINT, sort, search);
}

export async function getTaskAttachmentById(id: number): Promise<TaskAttachmentAPIResponse | null> {
  return getById<TaskAttachmentAPIResponse>(ENDPOINT, id);
}

export async function createTaskAttachment(attachment: Partial<TaskAttachmentAPIResponse>): Promise<TaskAttachmentAPIResponse | null> {
  return create<TaskAttachmentAPIResponse>(ENDPOINT, attachment);
}

export async function updateTaskAttachment(id: number, attachment: Partial<TaskAttachmentAPIResponse>): Promise<TaskAttachmentAPIResponse | null> {
  return put<TaskAttachmentAPIResponse>(ENDPOINT, id, attachment);
}

export async function deleteTaskAttachment(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
