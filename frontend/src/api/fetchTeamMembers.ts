import { BASE_URL } from "./constants.js";

/* Função para obter a lista de membros de equipa */
export async function getTeamMembers(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}team_members`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter membros de equipa " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter membros de equipa:", error);
    return [];
  }
}

/* Função para obter um membro de equipa específico por ID */
export async function getTeamMemberById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}team_members/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o membro de equipa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o membro de equipa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo membro de equipa */
export async function createTeamMember(member: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}team_members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o membro de equipa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o membro de equipa:", error);
    return null;
  }
}

/* Função para atualizar um membro de equipa existente */
export async function updateTeamMember(id: number, member: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}team_members/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o membro de equipa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o membro de equipa:", error);
    return null;
  }
}

/* Função para excluir um membro de equipa por ID */
export async function deleteTeamMember(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}team_members/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o membro de equipa " + res.status);
    }
    console.log(`Membro de equipa com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o membro de equipa com ID ${id}:`, error);
    return false;
  }
}
