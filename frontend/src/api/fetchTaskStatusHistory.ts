import { BASE_URL } from "./constants.js";

/* Função para obter a lista de históricos de status de tarefas */
export async function getTaskStatusHistories(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}task_status_history`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter históricos de status de tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter históricos de status de tarefas:", error);
    return [];
  }
}

/* Função para obter um histórico de status de tarefa específico por ID */
export async function getTaskStatusHistoryById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_status_history/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o histórico de status de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o histórico de status de tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo histórico de status de tarefa */
export async function createTaskStatusHistory(history: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_status_history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(history),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o histórico de status de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o histórico de status de tarefa:", error);
    return null;
  }
}

/* Função para atualizar um histórico de status de tarefa existente */
export async function updateTaskStatusHistory(id: number, history: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_status_history/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(history),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o histórico de status de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o histórico de status de tarefa:", error);
    return null;
  }
}

/* Função para excluir um histórico de status de tarefa por ID */
export async function deleteTaskStatusHistory(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}task_status_history/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o histórico de status de tarefa " + res.status);
    }
    console.log(`Histórico de status de tarefa com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o histórico de status de tarefa com ID ${id}:`, error);
    return false;
  }
}
