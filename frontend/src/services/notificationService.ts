import { SystemLogger } from "../logs/SystemLogger.js";
import { UserRole } from "../security/UserRole.js";
import { UserService } from "./index.js";
import Notifications from "../notifications/Notifications.js";

/* Serviço para gerenciar notificações */
export class NotificationService {
  /* Adiciona usuários ao serviço de notificação */
  static notifyUser(userId: number, message: string) {
    const user = UserService.getUserById(userId);
    if (user) {
      const notification = new Notifications(message);
      SystemLogger.log(
        `NOTIF -> ${user.getName()}: ${notification.getMessage()}.\n`,
      );
    }
  }

  /* Notifica um grupo de utilizadores */
  static notifyGroup(userIds: number[], message: string) {
    userIds.forEach((userId) => this.notifyUser(userId, message));
  }

  /* Notifica todos os administradores */
  static notifyAdmins(message: string) {
    const adminUsers = UserService.getAllUsers().filter(
      (u) => u.getRole() === UserRole.ADMIN,
    );
    adminUsers.forEach((admin) => this.notifyUser(admin.getId(), message));
  }
}
