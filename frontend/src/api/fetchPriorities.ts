import { BASE_URL } from "./constants.js";

/* Função para obter a lista de prioridades */
export async function getPriorities(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}priorities`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter prioridades " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter prioridades:", error);
    return [];
  }
}

/* Função para obter uma prioridade específica por ID */
export async function getPriorityById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}priorities/${id}`);
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível obter a prioridade " + res.status,
      );
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a prioridade com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova prioridade */
export async function createPriority(priority: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}priorities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(priority),
    });
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível criar a prioridade " + res.status,
      );
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a prioridade:", error);
    return null;
  }
}

/* Função para atualizar uma prioridade existente */
export async function updatePriority(
  id: number,
  priority: any,
): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}priorities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(priority),
    });
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível atualizar a prioridade " + res.status,
      );
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a prioridade:", error);
    return null;
  }
}

/* Função para excluir uma prioridade por ID */
export async function deletePriority(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}priorities/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível excluir a prioridade " + res.status,
      );
    }
    console.log(`Prioridade com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a prioridade com ID ${id}:`, error);
    return false;
  }
}
