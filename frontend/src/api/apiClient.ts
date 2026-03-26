import { BASE_URL } from "./utils/index.js";

/* Função genérica para GET - obter lista de recursos */
export async function get<T>(
  endpoint: string,
  sort?: string,
  search?: string,
): Promise<T[]> {
  try {
    let url = `${BASE_URL}${endpoint}`;
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
      throw new Error(
        `ERRO: Não foi possível obter dados de ${endpoint} - ${res.status}`,
      );
    }

    const data: T[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter ${endpoint}:`, error);
    return [];
  }
}

/* Função genérica para GET por ID - obter um recurso específico */
export async function getById<T>(
  endpoint: string,
  id: number | string,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}/${id}`);
    if (!res.ok) {
      throw new Error(
        `ERRO: Não foi possível obter ${endpoint}/${id} - ${res.status}`,
      );
    }

    const data: T = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter ${endpoint} com ID ${id}:`, error);
    return null;
  }
}

/* Função genérica para POST/CREATE - criar um novo recurso */
export async function create<T>(
  endpoint: string,
  payload: any,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(
        `ERRO: Não foi possível criar em ${endpoint} - ${res.status}`,
      );
    }

    const data: T = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao criar em ${endpoint}:`, error);
    return null;
  }
}

/* Função genérica para PUT/UPDATE - atualizar um recurso */
export async function put<T>(
  endpoint: string,
  id: number | string,
  payload: any,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(
        `ERRO: Não foi possível atualizar em ${endpoint}/${id} - ${res.status}`,
      );
    }

    const data: T = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar ${endpoint}/${id}:`, error);
    return null;
  }
}

/* Função genérica para DELETE - deletar um recurso */
export async function remove(
  endpoint: string,
  id: number | string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(
        `ERRO: Não foi possível deletar em ${endpoint}/${id} - ${res.status}`,
      );
    }

    console.log(`${endpoint}/${id} deletado com sucesso`);
    return true;
  } catch (error) {
    console.error(`Erro ao deletar ${endpoint}/${id}:`, error);
    return false;
  }
}

/* Função genérica para PATCH - atualização parcial de um recurso */
export async function patch<T>(
  endpoint: string,
  id: number | string,
  payload: any,
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(
        `ERRO: Não foi possível atualizar parcialmente ${endpoint}/${id} - ${res.status}`,
      );
    }

    const data: T = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar parcialmente ${endpoint}/${id}:`, error);
    return null;
  }
}
