import { get, getById, create, put, remove } from "./index.js";
import { TaskAttachmentAPIResponse } from "./dto/index.js";

const ENDPOINT = "task_attachments";

/* Função para obter a lista de anexos de tarefas */
export async function getTaskAttachments(
  sort?: string,
  search?: string,
): Promise<TaskAttachmentAPIResponse[]> {
  return get<TaskAttachmentAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter um anexo de tarefa por ID */
export async function getTaskAttachmentById(
  id: number,
): Promise<TaskAttachmentAPIResponse | null> {
  return getById<TaskAttachmentAPIResponse>(ENDPOINT, id);
}

/* Função para criar um novo anexo de tarefa */
export async function createTaskAttachment(
  attachment: Partial<TaskAttachmentAPIResponse>,
): Promise<TaskAttachmentAPIResponse | null> {
  return create<TaskAttachmentAPIResponse>(ENDPOINT, attachment);
}

/* Função para atualizar um anexo de tarefa */
export async function updateTaskAttachment(
  id: number,
  attachment: Partial<TaskAttachmentAPIResponse>,
): Promise<TaskAttachmentAPIResponse | null> {
  return put<TaskAttachmentAPIResponse>(ENDPOINT, id, attachment);
}

/* Função para deletar um anexo de tarefa */
export async function deleteTaskAttachment(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
