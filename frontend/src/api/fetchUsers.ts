import { BASE_URL } from "./constants.js";
import { IUser, UserClass } from "../models/index.js";
import Notifications from "../notifications/Notifications.js";

/* ======================== GET ======================== */

/* Converter objeto plano para instância de UserClass */
function mapToUserClass(data: any): UserClass {
  return new UserClass(
    data.id,
    data.name,
    data.email,
    data.phone,
    data.gender,
    getStatus(data.active),
    data.role,
  );
}

/* Converter objeto plano para instância de Notifications */
function mapToNotifications(data: any): Notifications {
  return new Notifications(
    data.id,
    data.title,
    data.message,
    data.is_read,
    data.sent_at,
  );
}

function getStatus(status: number): boolean {
  return status === 1 ? true : false;
}

/* Função para obter a lista de utilizadores */
export async function getUsers(
  sort?: string,
  search?: string,
): Promise<IUser[]> {
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
      throw new Error(
        "ERRO: Não foi possível obter utilizadores " + res.status,
      );
    }
    const data: any[] = await res.json();
    console.table(data);
    const users = data.map(mapToUserClass);
    return users;
  } catch (error) {
    console.error("Erro ao obter utilizadores:", error);
    return [];
  }
}

/* Função para obter um utilizador por ID */
export async function getUserById(id: number): Promise<IUser | null> {
  try {
    const res = await fetch(`${BASE_URL}users/${id}`);
    if (!res.ok) {
      return null;
    }
    const data: any = await res.json();
    return mapToUserClass(data);
  } catch (error) {
    console.error("Erro ao obter utilizador:", error);
    return null;
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
export async function getUnreadNotifications(userId: number): Promise<Notifications[]> {
  const res = await fetch(`${BASE_URL}users/${userId}/notifications/unread`);
  if (!res.ok) {
    throw new Error(
      "ERRO: Não foi possível obter notificações não lidas " + res.status,
    );
  }
  const data: any[] = await res.json();
  const notifications = Array.isArray(data) 
    ? data.map(mapToNotifications)
    : [mapToNotifications(data)];
  return notifications;
}

/* Função para obter todas as notificações do utilizador */
export async function getNotificationsByUser(userId: number): Promise<Notifications[]> {
  const res = await fetch(`${BASE_URL}users/${userId}/notifications`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter notificações " + res.status);
  }
  const data: any[] = await res.json();
  const notifications = Array.isArray(data) 
    ? data.map(mapToNotifications)
    : [mapToNotifications(data)];
  return notifications;
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
  const data: any = await res.json();
  return mapToUserClass(data);
}

/* ======================== PUT ======================== */

/* Função para atualizar um utilizador */
export async function updateUser(
  userId: number,
  userData: Partial<IUser>,
): Promise<IUser> {
  const res = await fetch(`${BASE_URL}users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    throw new Error(
      "ERRO: Não foi possível atualizar utilizador " + res.status,
    );
  }
  const data: any = await res.json();
  return mapToUserClass(data);
}

/* ======================== PATCH ======================== */

/* Função para ativar/desativar um utilizador */
export async function toggleUserActive(
  userId: number,
  active: boolean,
): Promise<IUser> {
  const res = await fetch(`${BASE_URL}users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ active }),
  });
  if (!res.ok) {
    throw new Error(
      "ERRO: Não foi possível atualizar utilizador " + res.status,
    );
  }
  const data: any = await res.json();
  return mapToUserClass(data);
}

/* Função para marcar uma notificação como lida */
export async function markNotificationAsRead(
  userId: number,
  notificationId: number,
): Promise<any> {
  const res = await fetch(
    `${BASE_URL}users/${userId}/notifications/${notificationId}`,
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
