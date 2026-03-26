/* Interface para uma notificação */
export interface INotification {
  getId(): number;
  getTitle(): string;
  getMessage(): string;
  isNotificationRead(): boolean;
  getSentAt(): Date;
  markAsRead(): void;
}
