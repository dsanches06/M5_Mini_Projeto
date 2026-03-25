import { BASE_URL } from "./constants.js";

/* Função para obter a lista de categorias */
export async function getCategories(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}categories`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter categorias " + res.status);
    }
    const data: any[] = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao obter categorias:", error);
    return [];
  }
}

/* Função para obter uma categoria específica por ID */
export async function getCategoryById(id: number): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}categories/${id}`);
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível obter a categoria " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error(`Erro ao obter a categoria com ID ${id}:`, error);
    return null;
  }
}

/* Função para criar uma nova categoria */
export async function createCategory(category: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível criar a categoria " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao criar a categoria:", error);
    return null;
  }
}

/* Função para atualizar uma categoria existente */
export async function updateCategory(id: number, category: any): Promise<any | null> {
  try {
    const res = await fetch(`${BASE_URL}categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível atualizar a categoria " + res.status);
    }
    const data: any = await res.json();
    console.table(data);
    return data;
  } catch (error) {
    console.error("Erro ao atualizar a categoria:", error);
    return null;
  }
}

/* Função para excluir uma categoria por ID */
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("ERRO: Não foi possível excluir a categoria " + res.status);
    }
    console.log(`Categoria com ID ${id} excluída com sucesso.`);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir a categoria com ID ${id}:`, error);
    return false;
  }
}
