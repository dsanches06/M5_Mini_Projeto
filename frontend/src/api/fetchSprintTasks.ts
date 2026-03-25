import { BASE_URL } from "./constants.js";

/* Função para obter a lista de tarefas de sprint */
export async function getSprintTasks(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}sprint_tasks`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter tarefas de sprint " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter tarefas de sprint:", error);
    return [];
  }
}

/* Função para obter uma tarefa de sprint específica por ID */
export async function getSprintTaskById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}sprint_tasks/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a tarefa de sprint " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a tarefa de sprint com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova tarefa de sprint */
export async function createSprintTask(sprintTask: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}sprint_tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sprintTask),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a tarefa de sprint " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a tarefa de sprint:", error);
    return null;
  }
}

/* Função para atualizar uma tarefa de sprint existente */
export async function updateSprintTask(id: number, sprintTask: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}sprint_tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sprintTask),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a tarefa de sprint " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a tarefa de sprint:", error);
    return null;
  }
}

/* Função para excluir uma tarefa de sprint por ID */
export async function deleteSprintTask(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}sprint_tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a tarefa de sprint " + res.status);
    }
    console.log(`Tarefa de sprint com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a tarefa de sprint com ID ${id}:`, error);
    return false;
  }
}
