import * as fetchNotifications from "../api/fetchNotifications.js";
import { INotifications } from "../notifications/INotifications.js";

/* Serviço para gerenciar notificações */
export class NotificationService {
  /* Obtém a lista de notificações da API */
  static async getNotifications(): Promise<INotifications[]> {
    return await fetchNotifications.getNotifications();
  }

  /* Obtém uma notificação por ID da API */
  static async getNotificationById(id: number): Promise<INotifications | null> {
    return await fetchNotifications.getNotificationById(id);
  }

  /* Cria uma nova notificação na API */
  static async createNotification(
    notification: INotifications,
  ): Promise<INotifications | null> {
    return await fetchNotifications.createNotification(notification);
  }

  /* Atualiza uma notificação na API */
  static async updateNotification(
    id: number,
    notification: INotifications,
  ): Promise<INotifications | null> {
    return await fetchNotifications.updateNotification(id, notification);
  }

  /* Exclui uma notificação na API */
  static async deleteNotification(id: number): Promise<boolean> {
    return await fetchNotifications.deleteNotification(id);
  }
}
