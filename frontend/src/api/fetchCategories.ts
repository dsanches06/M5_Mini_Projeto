import { get, getById, create, put, remove } from "./index.js";
import { CategoryAPIResponse } from "./dto/index.js";

const ENDPOINT = "categories";

/* Função para obter a lista de categorias */
export async function getCategories(
  sort?: string,
  search?: string,
): Promise<CategoryAPIResponse[]> {
  return get<CategoryAPIResponse>(ENDPOINT, sort, search);
}

/* Função para obter uma categoria específica por ID */
export async function getCategoryById(id: number): Promise<CategoryAPIResponse | null> {
  return getById<CategoryAPIResponse>(ENDPOINT, id);
}

/* Função para criar uma nova categoria */
export async function createCategory(category: Partial<CategoryAPIResponse>): Promise<CategoryAPIResponse | null> {
  return create<CategoryAPIResponse>(ENDPOINT, category);
}

/* Função para atualizar uma categoria existente */
export async function updateCategory(
  id: number,
  category: Partial<CategoryAPIResponse>,
): Promise<CategoryAPIResponse | null> {
  return put<CategoryAPIResponse>(ENDPOINT, id, category);
}

/* Função para excluir uma categoria por ID */
export async function deleteCategory(id: number): Promise<boolean> {
  return remove(ENDPOINT, id);
}
