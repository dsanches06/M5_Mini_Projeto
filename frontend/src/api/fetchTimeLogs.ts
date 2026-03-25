import { BASE_URL } from "./constants.js";

/* Função para obter a lista de registos de tempo */
export async function getTimeLogs(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}time_logs`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter registos de tempo " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter registos de tempo:", error);
    return [];
  }
}

/* Função para obter um registo de tempo específico por ID */
export async function getTimeLogById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}time_logs/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o registo de tempo " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o registo de tempo com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo registo de tempo */
export async function createTimeLog(timeLog: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}time_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeLog),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o registo de tempo " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o registo de tempo:", error);
    return null;
  }
}

/* Função para atualizar um registo de tempo existente */
export async function updateTimeLog(id: number, timeLog: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}time_logs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeLog),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o registo de tempo " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o registo de tempo:", error);
    return null;
  }
}

/* Função para excluir um registo de tempo por ID */
export async function deleteTimeLog(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}time_logs/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o registo de tempo " + res.status);
    }
    console.log(`Registo de tempo com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o registo de tempo com ID ${id}:`, error);
    return false;
  }
}
