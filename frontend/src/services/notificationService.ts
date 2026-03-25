import * as fetchNotifications from "../api/fetchNotifications.js";
import { SystemLogger } from "../logs/SystemLogger.js";
import { UserRole } from "../security/UserRole.js";
import { UserService } from "./index.js";
import Notifications from "../notifications/Notifications.js";

/* Serviço para gerenciar notificações */
export class NotificationService {
  /* Obtém a lista de notificações da API */
  static async getNotifications(): Promise<any[]> {
    return await fetchNotifications.getNotifications();
  }

  /* Obtém uma notificação por ID da API */
  static async getNotificationById(id: number): Promise<any | null> {
    return await fetchNotifications.getNotificationById(id);
  }

  /* Cria uma nova notificação na API */
  static async createNotification(notification: any): Promise<any | null> {
    return await fetchNotifications.createNotification(notification);
  }

  /* Atualiza uma notificação na API */
  static async updateNotification(
    id: number,
    notification: any,
  ): Promise<any | null> {
    return await fetchNotifications.updateNotification(id, notification);
  }

  /* Exclui uma notificação na API */
  static async deleteNotification(id: number): Promise<boolean> {
    return await fetchNotifications.deleteNotification(id);
  }
}
