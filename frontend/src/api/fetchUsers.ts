import { BASE_URL } from "./constants.js";
import { IUser } from "../models/index.js";

/* ======================== GET ======================== */

/* Função para obter a lista de utilizadores */
export async function getUsers(sort?: string, search?: string): Promise<IUser[]> {
  try {
    let url = `${BASE_URL}users`;
    const params: string[] = [];

    if (sort) {
      params.push(`sort=${encodeURIComponent(sort)}`);
    }
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter utilizadores " + res.status);
    }
    const data: IUser[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter utilizadores:", error);
    return [];
  }
}

/* Função para obter estatísticas de utilizadores */
export async function getUserStats(): Promise<any> {
  const res = await fetch(`${BASE_URL}users/stats`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter estatísticas " + res.status);
  }
  const data = await res.json();
  return data;
}

/* Função para obter notificações não lidas do utilizador */
export async function getUnreadNotifications(userId: number): Promise<any[]> {
  const res = await fetch(`${BASE_URL}users/${userId}/notifications/unread`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter notificações não lidas " + res.status);
  }
  const data = await res.json();
  return data;
}

/* Função para obter todas as notificações do utilizador */
export async function getNotificationsByUser(userId: number): Promise<any[]> {
  const res = await fetch(`${BASE_URL}users/${userId}/notifications`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter notificações " + res.status);
  }
  const data = await res.json();
  return data;
}

/* ======================== POST ======================== */

/* Função para criar um novo utilizador */
export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  const res = await fetch(`${BASE_URL}users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível criar utilizador " + res.status);
  }
  const data: IUser = await res.json();
  return data;
}

/* ======================== PUT ======================== */

/* Função para atualizar um utilizador */
export async function updateUser(userId: number, userData: Partial<IUser>): Promise<IUser> {
  const res = await fetch(`${BASE_URL}users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível atualizar utilizador " + res.status);
  }
  const data: IUser = await res.json();
  return data;
}

/* ======================== PATCH ======================== */

/* Função para ativar/desativar um utilizador */
export async function toggleUserActive(userId: number): Promise<IUser> {
  const res = await fetch(`${BASE_URL}users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível atualizar utilizador " + res.status);
  }
  const data: IUser = await res.json();
  return data;
}

/* Função para marcar uma notificação como lida */
export async function markNotificationAsRead(userId: number, notificationId: number): Promise<any> {
  const res = await fetch(`${BASE_URL}users/${userId}/notifications/${notificationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível marcar notificação como lida " + res.status);
  }
  const data = await res.json();
  return data;
}

/* ======================== DELETE ======================== */

/* Função para deletar um utilizador */
export async function deleteUser(userId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível deletar utilizador " + res.status);
  }
}
