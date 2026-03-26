import { get, getById, create, put, patch, remove } from "./index.js";
import { IUser } from "../models/index.js";
import Notifications from "../notifications/Notifications.js";
import { BASE_URL } from "./utils/index.js";
import {
  mapToUserClass,
  mapToNotifications,
  UserAPIResponse,
  NotificationAPIResponse,
  UserStatsAPIResponse,
} from "./dto/index.js";

const ENDPOINT = "users";

/* Função para obter a lista de utilizadores */
export async function apiGetUsers(
  sort?: string,
  search?: string,
): Promise<IUser[]> {
  const data = await get<UserAPIResponse>(ENDPOINT, sort, search);
  return data.map(mapToUserClass);
}

/* Função para obter um utilizador por ID */
export async function apiGetUserById(id: number): Promise<IUser | null> {
  const data = await getById<UserAPIResponse>(ENDPOINT, id);
  return data ? mapToUserClass(data) : null;
}

/* Função para obter estatísticas de utilizadores */
export async function apiGetUserStats(): Promise<UserStatsAPIResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/stats`);
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível obter estatísticas " + res.status,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return null;
  }
}

/* Função para obter notificações não lidas do utilizador */
export async function apiGetUnreadNotifications(
  userId: number,
): Promise<Notifications[]> {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINT}/${userId}/notifications/unread`,
    );
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível obter notificações não lidas " + res.status,
      );
    }
    const data: NotificationAPIResponse[] = await res.json();
    const notifications = Array.isArray(data)
      ? data.map(mapToNotifications)
      : [mapToNotifications(data)];
    return notifications;
  } catch (error) {
    console.error("Erro ao obter notificações não lidas:", error);
    return [];
  }
}

/* Função para obter todas as notificações do utilizador */
export async function apiGetNotificationsByUser(
  userId: number,
): Promise<Notifications[]> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${userId}/notifications`);
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível obter notificações " + res.status,
      );
    }
    const data: NotificationAPIResponse[] = await res.json();
    const notifications = Array.isArray(data)
      ? data.map(mapToNotifications)
      : [mapToNotifications(data)];
    return notifications;
  } catch (error) {
    console.error("Erro ao obter notificações:", error);
    return [];
  }
}

/* ======================== POST ======================== */

/* Função para criar um novo utilizador */
export async function apiCreateUser(
  userData: Partial<IUser>,
): Promise<IUser | null> {
  const data = await create<UserAPIResponse>(ENDPOINT, userData);
  return data ? mapToUserClass(data) : null;
}

/* Função para atualizar um utilizador */
export async function apiUpdateUser(
  userId: number,
  userData: Partial<IUser>,
): Promise<IUser | null> {
  const data = await put<UserAPIResponse>(ENDPOINT, userId, userData);
  return data ? mapToUserClass(data) : null;
}

/* Função para ativar/desativar um utilizador */
export async function apiToggleUserActive(
  userId: number,
  active: boolean,
): Promise<IUser | null> {
  const data = await patch<UserAPIResponse>(ENDPOINT, userId, { active });
  return data ? mapToUserClass(data) : null;
}

/* Função para marcar uma notificação como lida */
export async function apiMarkNotificationAsRead(
  userId: number,
  notificationId: number,
): Promise<NotificationAPIResponse | null> {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINT}/${userId}/notifications/${notificationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível marcar notificação como lida " + res.status,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return null;
  }
}

/* Função para deletar um utilizador */
export async function apiDeleteUser(userId: number): Promise<boolean> {
  return remove(ENDPOINT, userId);
}
