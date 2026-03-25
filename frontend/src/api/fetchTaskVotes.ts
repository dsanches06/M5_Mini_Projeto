import { BASE_URL } from "./constants.js";

/* Função para obter a lista de votos de tarefas */
export async function getTaskVotes(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}task_votes`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter votos de tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter votos de tarefas:", error);
    return [];
  }
}

/* Função para obter um voto de tarefa específico por ID */
export async function getTaskVoteById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_votes/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o voto de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o voto de tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo voto de tarefa */
export async function createTaskVote(vote: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vote),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o voto de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o voto de tarefa:", error);
    return null;
  }
}

/* Função para atualizar um voto de tarefa existente */
export async function updateTaskVote(id: number, vote: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_votes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vote),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o voto de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o voto de tarefa:", error);
    return null;
  }
}

/* Função para excluir um voto de tarefa por ID */
export async function deleteTaskVote(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}task_votes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o voto de tarefa " + res.status);
    }
    console.log(`Voto de tarefa com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o voto de tarefa com ID ${id}:`, error);
    return false;
  }
}
