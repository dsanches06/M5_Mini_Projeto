import { db } from "../db.js";

<<<<<<< HEAD
/* Função para buscar todas as notificações */
export const getAllNotifications = async () => {
  const [notifications] = await db.query("SELECT * FROM notificacao");
  return notifications;
};

/* Função para buscar notificações por ID do usuário */
export const getNotificationsByUserId = async (userId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notificacao WHERE usuarioId = ?",
    [userId],
  );
  return notifications;
};

/* Função para criar notificação */
export const createNotification = async (data) => {
  const [result] = await db.query(
    "INSERT INTO notificacao (usuarioId, mensagem, data) VALUES (?, ?, ?)",
    [data.usuarioId, data.mensagem, data.data || new Date().toISOString()],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar notificação */
export const updateNotification = async (notificationId, data) => {
  const { mensagem, data: dataNotif } = data;
  const [result] = await db.query(
    "UPDATE notificacao SET mensagem=?, data=? WHERE id=?",
    [mensagem, dataNotif, notificationId],
  );
  return result;
};

/* Função para deletar notificação */
export const deleteNotification = async (notificationId) => {
  const [result] = await db.query("DELETE FROM notificacao WHERE id=?", [
    notificationId,
  ]);
  return result;
=======
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
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
};
