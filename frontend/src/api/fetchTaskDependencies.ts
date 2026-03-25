import { BASE_URL } from "./constants.js";

/* Função para obter a lista de dependências de tarefas */
export async function getTaskDependencies(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}task_dependencies`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter dependências de tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter dependências de tarefas:", error);
    return [];
  }
}

/* Função para obter uma dependência de tarefa específica por ID */
export async function getTaskDependencyById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_dependencies/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a dependência de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a dependência de tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova dependência de tarefa */
export async function createTaskDependency(dependency: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_dependencies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dependency),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a dependência de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a dependência de tarefa:", error);
    return null;
  }
}

/* Função para atualizar uma dependência de tarefa existente */
export async function updateTaskDependency(id: number, dependency: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_dependencies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dependency),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a dependência de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a dependência de tarefa:", error);
    return null;
  }
}

/* Função para excluir uma dependência de tarefa por ID */
export async function deleteTaskDependency(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}task_dependencies/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a dependência de tarefa " + res.status);
    }
    console.log(`Dependência de tarefa com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a dependência de tarefa com ID ${id}:`, error);
    return false;
  }
}
