import { db } from "../db.js";

/* Função para  */
export const getAllNotifications = () => {
  return notifications;
};

/* Função para  */
export const getNotificationsByUserId = (userId) => {
  return notifications.filter((n) => n.userId === userId);
};

/* Função para  */
export const createNotification = (data) => {
  const notification = {
    userId: data.userId,
    message: data.message,
    date: data.date,
  };
  notifications.push(notification);
  return notification;
};

/* Função para  */
export const updateNotification = (notificationId, data) => {
  const notification = notifications.find((n) => n.id === notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.message = data.message ?? notification.message;
  notification.date = data.date ?? notification.date;

  return notification;
};

/* Função para  */
export const deleteNotification = (notificationId) => {
  notifications = notifications.filter((n) => n.id !== notificationId);
};
