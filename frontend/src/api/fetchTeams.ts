import { BASE_URL } from "./constants.js";

/* Função para obter a lista de equipas */
export async function getTeams(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}teams`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter equipas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter equipas:", error);
    return [];
  }
}

/* Função para obter uma equipa específica por ID */
export async function getTeamById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}teams/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a equipa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a equipa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova equipa */
export async function createTeam(team: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a equipa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a equipa:", error);
    return null;
  }
}

/* Função para atualizar uma equipa existente */
export async function updateTeam(id: number, team: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}teams/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a equipa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a equipa:", error);
    return null;
  }
}

/* Função para excluir uma equipa por ID */
export async function deleteTeam(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}teams/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a equipa " + res.status);
    }
    console.log(`Equipa com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a equipa com ID ${id}:`, error);
    return false;
  }
}
