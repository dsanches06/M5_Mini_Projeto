import { get, getById, create, put, remove } from "./index.js";
import { INotifications } from "../notifications/INotifications.js";

const ENDPOINT = "notifications";

/* Função para obter a lista de notificações */
export async function getNotifications(
  sort?: string,
  search?: string,
): Promise<INotifications[]> {
  return get<INotifications>(ENDPOINT, sort, search);
}

/* Função para obter uma notificação específica por ID */
export async function getNotificationById(
  id: number,
): Promise<INotifications | null> {
  return getById<INotifications>(ENDPOINT, id);
}

/* Função para criar uma nova notificação */
export async function createNotification(
  notification: INotifications,
): Promise<INotifications | null> {
  return create<INotifications>(ENDPOINT, notification);
}

/* Função para atualizar uma notificação existente */
export async function updateNotification(
  id: number,
  notification: INotifications,
): Promise<INotifications | null> {
  return put<INotifications>(ENDPOINT, id, notification);
}

/* Função para excluir uma notificação por ID */
export async function deleteNotification(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
