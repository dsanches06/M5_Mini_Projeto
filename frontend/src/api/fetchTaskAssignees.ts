import { BASE_URL } from "./constants.js";

/* Função para obter a lista de atribuições de tarefas */
export async function getTaskAssignees(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}task_assignees`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter atribuições de tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter atribuições de tarefas:", error);
    return [];
  }
}

/* Função para obter uma atribuição de tarefa específica por ID */
export async function getTaskAssigneeById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_assignees/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a atribuição de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a atribuição de tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova atribuição de tarefa */
export async function createTaskAssignee(assignee: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_assignees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignee),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a atribuição de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a atribuição de tarefa:", error);
    return null;
  }
}

/* Função para atualizar uma atribuição de tarefa existente */
export async function updateTaskAssignee(id: number, assignee: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_assignees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignee),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a atribuição de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a atribuição de tarefa:", error);
    return null;
  }
}

/* Função para excluir uma atribuição de tarefa por ID */
export async function deleteTaskAssignee(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}task_assignees/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a atribuição de tarefa " + res.status);
    }
    console.log(`Atribuição de tarefa com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a atribuição de tarefa com ID ${id}:`, error);
    return false;
  }
}
