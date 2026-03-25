import { BASE_URL } from "./constants.js";

/* Função para obter a lista de status de tarefas */
export async function getTaskStatuses(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}task_status`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter status de tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter status de tarefas:", error);
    return [];
  }
}

/* Função para obter um status de tarefa específico por ID */
export async function getTaskStatusById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_status/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o status de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o status de tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo status de tarefa */
export async function createTaskStatus(status: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o status de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o status de tarefa:", error);
    return null;
  }
}

/* Função para atualizar um status de tarefa existente */
export async function updateTaskStatus(id: number, status: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o status de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o status de tarefa:", error);
    return null;
  }
}

/* Função para excluir um status de tarefa por ID */
export async function deleteTaskStatus(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}task_status/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o status de tarefa " + res.status);
    }
    console.log(`Status de tarefa com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o status de tarefa com ID ${id}:`, error);
    return false;
  }
}
