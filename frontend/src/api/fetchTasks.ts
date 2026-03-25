import { BASE_URL } from "./constants.js";
import { ITask } from "../tasks/index.js";

/* ======================== GET ======================== */

/* Função para obter a lista de tarefas */
export async function getTasks(
  sort?: string,
  search?: string,
): Promise<ITask[]> {
  try {
    let url = `${BASE_URL}tasks`;
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
      throw new Error("ERRO: Não foi possível obter tarefas " + res.status);
    }
    const data: ITask[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter tarefas:", error);
    return [];
  }
}

/* Função para obter estatísticas de tarefas */
export async function getTaskStats(): Promise<any> {
  const res = await fetch(`${BASE_URL}tasks/stats`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter estatísticas " + res.status);
  }
  const data = await res.json();
  return data;
}

/* Função para obter tags de uma tarefa */
export async function getTaskTags(taskId: number): Promise<any[]> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/tags`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter tags " + res.status);
  }
  const data = await res.json();
  return data;
}

/* Função para obter comentários de uma tarefa */
export async function getTaskComments(taskId: number): Promise<any[]> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/comments`);
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível obter comentários " + res.status);
  }
  const data = await res.json();
  return data;
}

/* ======================== POST ======================== */

/* Função para criar uma nova tarefa */
export async function createTask(taskData: Partial<ITask>): Promise<ITask> {
  const res = await fetch(`${BASE_URL}tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível criar tarefa " + res.status);
  }
  const data: ITask = await res.json();
  return data;
}

/* Função para adicionar uma tag a uma tarefa */
export async function addTagToTask(taskId: number, tagData: any): Promise<any> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tagData),
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível adicionar tag " + res.status);
  }
  const data = await res.json();
  return data;
}

/* Função para criar um comentário em uma tarefa */
export async function createTaskComment(
  taskId: number,
  commentData: any,
): Promise<any> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível criar comentário " + res.status);
  }
  const data = await res.json();
  return data;
}

/* ======================== PUT ======================== */

/* Função para atualizar uma tarefa */
export async function updateTask(
  taskId: number,
  taskData: Partial<ITask>,
): Promise<ITask> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível atualizar tarefa " + res.status);
  }
  const data: ITask = await res.json();
  return data;
}

/* Função para atualizar um comentário */
export async function updateTaskComment(
  taskId: number,
  commentId: number,
  commentData: any,
): Promise<any> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentData),
  });
  if (!res.ok) {
    throw new Error(
      "ERRO: Não foi possível atualizar comentário " + res.status,
    );
  }
  const data = await res.json();
  return data;
}

/* ======================== PATCH ======================== */

/* Função para marcar uma tarefa como concluída */
export async function markTaskAsCompleted(taskId: number): Promise<ITask> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível atualizar tarefa " + res.status);
  }
  const data: ITask = await res.json();
  return data;
}

/* Função para resolver um comentário */
export async function resolveTaskComment(
  taskId: number,
  commentId: number,
): Promise<any> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível resolver comentário " + res.status);
  }
  const data = await res.json();
  return data;
}

/* ======================== DELETE ======================== */

/* Função para deletar uma tarefa */
export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível deletar tarefa " + res.status);
  }
}

/* Função para remover uma tag de uma tarefa */
export async function removeTagFromTask(
  taskId: number,
  tagId: number,
): Promise<void> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/tags/${tagId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível remover tag " + res.status);
  }
}

/* Função para deletar um comentário */
export async function deleteTaskComment(
  taskId: number,
  commentId: number,
): Promise<void> {
  const res = await fetch(`${BASE_URL}tasks/${taskId}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("ERRO: Não foi possível deletar comentário " + res.status);
  }
}
