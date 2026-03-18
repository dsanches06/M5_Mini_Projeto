import { db } from "../db.js";

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
};
