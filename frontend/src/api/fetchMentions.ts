import { BASE_URL } from "./constants.js";

/* Função para obter a lista de menções */
export async function getMentions(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}mentions`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter menções " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter menções:", error);
    return [];
  }
}

/* Função para obter uma menção específica por ID */
export async function getMentionById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}mentions/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a menção " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a menção com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova menção */
export async function createMention(mention: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}mentions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mention),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a menção " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a menção:", error);
    return null;
  }
}

/* Função para atualizar uma menção existente */
export async function updateMention(id: number, mention: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}mentions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mention),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a menção " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a menção:", error);
    return null;
  }
}

/* Função para excluir uma menção por ID */
export async function deleteMention(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}mentions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a menção " + res.status);
    }
    console.log(`Menção com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a menção com ID ${id}:`, error);
    return false;
  }
}
