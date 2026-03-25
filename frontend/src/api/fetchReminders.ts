import { BASE_URL } from "./constants.js";

/* Função para obter a lista de lembretes */
export async function getReminders(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}reminders`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter lembretes " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter lembretes:", error);
    return [];
  }
}

/* Função para obter um lembrete específico por ID */
export async function getReminderById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}reminders/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o lembrete " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o lembrete com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo lembrete */
export async function createReminder(reminder: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reminder),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o lembrete " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o lembrete:", error);
    return null;
  }
}

/* Função para atualizar um lembrete existente */
export async function updateReminder(id: number, reminder: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}reminders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reminder),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o lembrete " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o lembrete:", error);
    return null;
  }
}

/* Função para excluir um lembrete por ID */
export async function deleteReminder(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}reminders/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o lembrete " + res.status);
    }
    console.log(`Lembrete com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o lembrete com ID ${id}:`, error);
    return false;
  }
}
