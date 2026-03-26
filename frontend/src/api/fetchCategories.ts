import { get, getById, create, put, remove } from "./index.js";

const ENDPOINT = "categories";

/* Função para obter a lista de categorias */
export async function getCategories(sort?: string, search?: string): Promise<any[]> {
  return get(ENDPOINT, sort, search);
}

/* Função para obter uma categoria específica por ID */
export async function getCategoryById(id: number): Promise<any | null> {
  return getById(ENDPOINT, id);
}

/* Função para criar uma nova categoria */
export async function createCategory(category: any): Promise<any | null> {
  return create(ENDPOINT, category);
}

/* Função para atualizar uma categoria existente */
export async function updateCategory(id: number, category: any): Promise<any | null> {
  return put(ENDPOINT, id, category);
}

/* Função para excluir uma categoria por ID */
export async function deleteCategory(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
