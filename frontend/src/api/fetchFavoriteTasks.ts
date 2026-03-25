import { BASE_URL } from "./constants.js";

/* Função para obter a lista de tarefas favoritas */
export async function getFavoriteTasks(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}favorite_tasks`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter tarefas favoritas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter tarefas favoritas:", error);
    return [];
  }
}

/* Função para obter uma tarefa favorita específica por ID */
export async function getFavoriteTaskById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}favorite_tasks/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a tarefa favorita " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a tarefa favorita com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova tarefa favorita */
export async function createFavoriteTask(favoriteTask: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}favorite_tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favoriteTask),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a tarefa favorita " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a tarefa favorita:", error);
    return null;
  }
}

/* Função para atualizar uma tarefa favorita existente */
export async function updateFavoriteTask(id: number, favoriteTask: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}favorite_tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favoriteTask),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a tarefa favorita " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a tarefa favorita:", error);
    return null;
  }
}

/* Função para excluir uma tarefa favorita por ID */
export async function deleteFavoriteTask(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}favorite_tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a tarefa favorita " + res.status);
    }
    console.log(`Tarefa favorita com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a tarefa favorita com ID ${id}:`, error);
    return false;
  }
}
