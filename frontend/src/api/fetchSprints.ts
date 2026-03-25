import { BASE_URL } from "./constants.js";

/* Função para obter a lista de sprints */
export async function getSprints(sort?: string, search?: string): Promise<any[]> {
  try {
    let url = `${BASE_URL}sprints`;
    const params: string[] = [];

    if (sort) {
      params.push(`sort=${encodeURIComponent(sort)}`);
    }
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter sprints " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter sprints:", error);
    return [];
  }
}

/* Função para obter um sprint específico por ID */
export async function getSprintById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}sprints/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o sprint " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o sprint com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo sprint */
export async function createSprint(sprint: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}sprints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sprint),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o sprint " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o sprint:", error);
    return null;
  }
}

/* Função para atualizar um sprint existente */
export async function updateSprint(id: number, sprint: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}sprints/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sprint),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o sprint " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o sprint:", error);
    return null;
  }
}

/* Função para excluir um sprint por ID */
export async function deleteSprint(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}sprints/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o sprint " + res.status);
    }
    console.log(`Sprint com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o sprint com ID ${id}:`, error);
    return false;
  }
}
