import { get, getById, create, put, patch, remove } from "./index.js";
import { ITask } from "../tasks/index.js";
import { BASE_URL } from "./utils/index.js";
import {
  TaskAPIResponse,
  TaskCommentAPIResponse,
  TagAPIResponse,
  TaskStatsAPIResponse,
  TagTaskAPIResponse,
} from "./dto/index.js";

const ENDPOINT = "tasks";

/* ======================== GET ======================== */

/* Função para obter a lista de tarefas */
export async function getTasks(
  sort?: string,
  search?: string,
): Promise<TaskAPIResponse[]> {
  return get<TaskAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter tarefas de um projeto específico */
export async function getTasksByProject(
  projectId: number,
  sort?: string,
  search?: string,
): Promise<TaskAPIResponse[]> {
  try {
    let url = `${BASE_URL}${ENDPOINT}/project/${projectId}`;
    if (sort || search) {
      const params = new URLSearchParams();
      if (sort) params.append("sort", sort);
      if (search) params.append("search", search);
      url += `?${params.toString()}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Não foi possível obter tarefas do projeto`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao obter tarefas do projeto:", error);
    throw error;
  }
}

/* Função para obter estatísticas de tarefas */
export async function getTaskStats(): Promise<TaskStatsAPIResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/stats`);
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível obter estatísticas " + res.status,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return null;
  }
}

/* Função para obter tags de uma tarefa */
export async function getTaskTags(taskId: number): Promise<TagAPIResponse[]> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${taskId}/tags`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter tags " + res.status);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter tags:", error);
    return [];
  }
}

/* Função para obter comentários de uma tarefa */
export async function getTaskComments(
  taskId: number,
): Promise<TaskCommentAPIResponse[]> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${taskId}/comments`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter comentários " + res.status);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter comentários:", error);
    return [];
  }
}

/* Função para criar uma nova tarefa */
export async function createTask(
  taskData: Partial<ITask>,
): Promise<ITask | null> {
  return create<ITask>(ENDPOINT, taskData);
}

/* Função para adicionar uma tag a uma tarefa */
export async function addTagToTask(taskId: number, tagData: Partial<TagTaskAPIResponse>): Promise<TagTaskAPIResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${taskId}/tags`, {
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
  } catch (error) {
    console.error("Erro ao adicionar tag:", error);
    return null;
  }
}

/* Função para criar um comentário em uma tarefa */
export async function createTaskComment(
  taskId: number,
  commentData: Partial<TaskCommentAPIResponse>,
): Promise<TaskCommentAPIResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${taskId}/comments`, {
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
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return null;
  }
}

/* Função para atualizar uma tarefa */
export async function updateTask(
  taskId: number,
  taskData: Partial<ITask>,
): Promise<ITask | null> {
  return put<ITask>(ENDPOINT, taskId, taskData);
}

/* Função para atualizar um comentário */
export async function updateTaskComment(
  taskId: number,
  commentId: number,
  commentData: Partial<TaskCommentAPIResponse>,
): Promise<TaskCommentAPIResponse | null> {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINT}/${taskId}/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      },
    );
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível atualizar comentário " + res.status,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);
    return null;
  }
}

/* Função para atualizar o status de uma tarefa */
export async function changeTaskStatus(
  taskId: number,
  statusId: number,
): Promise<ITask | null> {
  return patch<ITask>(ENDPOINT, taskId, { statusId });
}

/* Função para resolver um comentário */
export async function resolveTaskComment(
  taskId: number,
  commentId: number,
): Promise<TaskCommentAPIResponse | null> {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINT}/${taskId}/comments/${commentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível resolver comentário " + res.status,
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao resolver comentário:", error);
    return null;
  }
}

/* Função para deletar uma tarefa */
export async function deleteTask(taskId: number): Promise<boolean> {
  return remove(ENDPOINT, taskId);
}

/* Função para remover uma tag de uma tarefa */
export async function removeTagFromTask(
  taskId: number,
  tagId: number,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}/${taskId}/tags/${tagId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível remover tag " + res.status);
    }
    return true;
  } catch (error) {
    console.error("Erro ao remover tag:", error);
    return false;
  }
}

/* Função para deletar um comentário */
export async function deleteTaskComment(
  taskId: number,
  commentId: number,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${BASE_URL}${ENDPOINT}/${taskId}/comments/${commentId}`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) {
      throw new Error(
        "ERRO: Não foi possível deletar comentário " + res.status,
      );
    }
    return true;
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    return false;
  }
}
