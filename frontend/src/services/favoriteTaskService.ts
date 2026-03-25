import * as fetchFavoriteTasks from "../api/fetchFavoriteTasks.js";

/* Serviço para gerenciar tarefas favoritas */
export class FavoriteTaskService {
  /* Função para obter a lista de tarefas favoritas */
  static async getFavoriteTasks(): Promise<any[]> {
    return await fetchFavoriteTasks.getFavoriteTasks();
  }

  /* Função para obter uma tarefa favorita por ID */
  static async getFavoriteTaskById(id: number): Promise<any | null> {
    return await fetchFavoriteTasks.getFavoriteTaskById(id);
  }

  /* Função para criar uma nova tarefa favorita */
  static async createFavoriteTask(favoriteTask: any): Promise<any | null> {
    return await fetchFavoriteTasks.createFavoriteTask(favoriteTask);
  }

  /* Função para atualizar uma tarefa favorita existente */
  static async updateFavoriteTask(id: number, favoriteTask: any): Promise<any | null> {
    return await fetchFavoriteTasks.updateFavoriteTask(id, favoriteTask);
  }

  /* Função para excluir uma tarefa favorita */
  static async deleteFavoriteTask(id: number): Promise<boolean> {
    return await fetchFavoriteTasks.deleteFavoriteTask(id);
  }
}
