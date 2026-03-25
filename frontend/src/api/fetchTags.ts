import { BASE_URL } from "./constants.js";

/* Função para obter a lista de tags */
export async function getTags(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}tags`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter tags " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter tags:", error);
    return [];
  }
}

/* Função para obter uma tag específica por ID */
export async function getTagById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}tags/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a tag " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a tag com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova tag */
export async function createTag(tag: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a tag " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a tag:", error);
    return null;
  }
}

/* Função para atualizar uma tag existente */
export async function updateTag(id: number, tag: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}tags/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a tag " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a tag:", error);
    return null;
  }
}

/* Função para excluir uma tag por ID */
export async function deleteTag(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}tags/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a tag " + res.status);
    }
    console.log(`Tag com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a tag com ID ${id}:`, error);
    return false;
  }
}
