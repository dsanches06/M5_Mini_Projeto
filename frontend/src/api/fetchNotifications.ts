import { BASE_URL } from "./constants.js";

/* Função para obter a lista de notificações */
export async function getNotifications(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}notifications`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter notificações " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter notificações:", error);
    return [];
  }
}

/* Função para obter uma notificação específica por ID */
export async function getNotificationById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}notifications/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a notificação " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a notificação com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova notificação */
export async function createNotification(notification: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a notificação " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a notificação:", error);
    return null;
  }
}

/* Função para atualizar uma notificação existente */
export async function updateNotification(id: number, notification: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}notifications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a notificação " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a notificação:", error);
    return null;
  }
}

/* Função para excluir uma notificação por ID */
export async function deleteNotification(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}notifications/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a notificação " + res.status);
    }
    console.log(`Notificação com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a notificação com ID ${id}:`, error);
    return false;
  }
}
