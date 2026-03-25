import { BASE_URL } from "./constants.js";

/* Função para obter a lista de tags-tarefas */
export async function getTagTasks(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}tags_task`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter tags-tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter tags-tarefas:", error);
    return [];
  }
}

/* Função para obter uma tag-tarefa específica por ID */
export async function getTagTaskById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}tags_task/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a tag-tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a tag-tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova tag-tarefa */
export async function createTagTask(tagTask: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}tags_task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tagTask),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a tag-tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a tag-tarefa:", error);
    return null;
  }
}

/* Função para atualizar uma tag-tarefa existente */
export async function updateTagTask(id: number, tagTask: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}tags_task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tagTask),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a tag-tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a tag-tarefa:", error);
    return null;
  }
}

/* Função para excluir uma tag-tarefa por ID */
export async function deleteTagTask(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}tags_task/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a tag-tarefa " + res.status);
    }
    console.log(`Tag-tarefa com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a tag-tarefa com ID ${id}:`, error);
    return false;
  }
}
