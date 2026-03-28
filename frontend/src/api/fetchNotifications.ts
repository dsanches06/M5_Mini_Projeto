import { get, getById, create, put, remove } from "./index.js";
import { NotificationAPIResponse } from "./dto/index.js";

const ENDPOINT = "notifications";

/* Função para obter a lista de notificações */
export async function getNotifications(
  sort?: string,
  search?: string,
): Promise<NotificationAPIResponse[]> {
  return get<NotificationAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma notificação específica por ID */
export async function getNotificationById(
  id: number,
): Promise<NotificationAPIResponse | null> {
  return getById<NotificationAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova notificação */
export async function createNotification(
  notification: NotificationAPIResponse,
): Promise<NotificationAPIResponse | null> {
  return create<NotificationAPIResponse>(ENDPOINT, notification);
}

/* Função para atualizar uma notificação existente */
export async function updateNotification(
  id: number,
  notification: NotificationAPIResponse,
): Promise<NotificationAPIResponse | null> {
  return put<NotificationAPIResponse>(ENDPOINT, id, notification);
}

/* Função para excluir uma notificação por ID */
export async function deleteNotification(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
