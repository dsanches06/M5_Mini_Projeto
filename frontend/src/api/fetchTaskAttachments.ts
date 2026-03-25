import { BASE_URL } from "./constants.js";

/* Função para obter a lista de anexos de tarefas */
export async function getTaskAttachments(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}task_attachments`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter anexos de tarefas " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter anexos de tarefas:", error);
    return [];
  }
}

/* Função para obter um anexo de tarefa específico por ID */
export async function getTaskAttachmentById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_attachments/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter o anexo de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter o anexo de tarefa com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar um novo anexo de tarefa */
export async function createTaskAttachment(attachment: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_attachments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attachment),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar o anexo de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar o anexo de tarefa:", error);
    return null;
  }
}

/* Função para atualizar um anexo de tarefa existente */
export async function updateTaskAttachment(id: number, attachment: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}task_attachments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attachment),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar o anexo de tarefa " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar o anexo de tarefa:", error);
    return null;
  }
}

/* Função para excluir um anexo de tarefa por ID */
export async function deleteTaskAttachment(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}task_attachments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir o anexo de tarefa " + res.status);
    }
    console.log(`Anexo de tarefa com ID ${id} excluído com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir o anexo de tarefa com ID ${id}:`, error);
    return false;
  }
}
