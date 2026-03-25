import * as fetchUsers from "../api/fetchUsers.js";
import { IUser } from "../models/index.js";

/* Serviço para gerenciar usuários */
export class UserService {
  /* Função para obter a lista de usuários */
  static async getUsers(sort?: string, search?: string): Promise<IUser[]> {
    return await fetchUsers.getUsers(sort, search);
  }

  /* Função para obter um usuário por ID da API */
  static async getUserById(id: number): Promise<IUser | null> {
    const res = await fetch(`http://localhost:3000/users/${id}`);
    if (!res.ok) {
      return null;
    }
    return await res.json();
  }

  /* Função para obter estatísticas de usuário */
  static async getUserStats(): Promise<any> {
    return await fetchUsers.getUserStats();
  }

  /* Função para obter notificações não lidas do usuário */
  static async getUnreadNotifications(userId: number): Promise<any[]> {
    return await fetchUsers.getUnreadNotifications(userId);
  }

  /* Função para obter todas as notificações do usuário */
  static async getNotificationsByUser(userId: number): Promise<any[]> {
    return await fetchUsers.getNotificationsByUser(userId);
  }

  /* Função para criar um novo usuário */
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await fetchUsers.createUser(userData);
  }

  /* Função para atualizar um usuário */
  static async updateUser(
    userId: number,
    userData: Partial<IUser>,
  ): Promise<IUser> {
    return await fetchUsers.updateUser(userId, userData);
  }

  /* Função para alternar ativo/inativo do usuário */
  static async toggleUserActive(
    userId: number,
    active: boolean,
  ): Promise<IUser> {
    return await fetchUsers.toggleUserActive(userId, active);
  }

  /* Função para marcar notificação como lida */
  static async markNotificationAsRead(
    userId: number,
    notificationId: number,
  ): Promise<any> {
    return await fetchUsers.markNotificationAsRead(userId, notificationId);
  }

  /* Função para deletar um usuário */
  static async deleteUser(userId: number): Promise<void> {
    return await fetchUsers.deleteUser(userId);
  }
}
