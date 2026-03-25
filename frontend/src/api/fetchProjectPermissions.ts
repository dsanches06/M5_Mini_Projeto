import { BASE_URL } from "./constants.js";

/* Função para obter a lista de permissões de projeto */
export async function getProjectPermissions(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}project_permissions`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter permissões de projeto " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter permissões de projeto:", error);
    return [];
  }
}

/* Função para obter uma permissão de projeto específica por ID */
export async function getProjectPermissionById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}project_permissions/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a permissão de projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a permissão de projeto com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova permissão de projeto */
export async function createProjectPermission(permission: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}project_permissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permission),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a permissão de projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a permissão de projeto:", error);
    return null;
  }
}

/* Função para atualizar uma permissão de projeto existente */
export async function updateProjectPermission(id: number, permission: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}project_permissions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permission),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a permissão de projeto " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a permissão de projeto:", error);
    return null;
  }
}

/* Função para excluir uma permissão de projeto por ID */
export async function deleteProjectPermission(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}project_permissions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a permissão de projeto " + res.status);
    }
    console.log(`Permissão de projeto com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a permissão de projeto com ID ${id}:`, error);
    return false;
  }
}
