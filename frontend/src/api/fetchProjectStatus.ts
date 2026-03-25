import { BASE_URL } from "./constants.js";

/* Função para obter a lista de status de projetos */
export async function getProjectStatuses(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}project_status`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter status de projetos " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter status de projetos:", error);
    return [];
  }
}

/* Função para obter um status de projeto específico por ID */
export async function getProjectStatusById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}project_status/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o status de projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o status de projeto com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo status de projeto */
export async function createProjectStatus(status: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}project_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o status de projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o status de projeto:", error);
    return null;
  }
}

/* Função para atualizar um status de projeto existente */
export async function updateProjectStatus(id: number, status: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}project_status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o status de projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o status de projeto:", error);
    return null;
  }
}

/* Função para excluir um status de projeto por ID */
export async function deleteProjectStatus(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}project_status/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o status de projeto " + res.status);
    }
    console.log(`Status de projeto com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o status de projeto com ID ${id}:`, error);
    return false;
  }
}
