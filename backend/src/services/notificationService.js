import { db } from "../db.js";

/* Função para buscar todas as notificações */
export const getAllNotifications = async () => {
  const [notifications] = await db.query("SELECT * FROM notificacao");
  return notifications;
};

/* Função para buscar notificações por ID do usuário */
export const getNotificationsByUserId = async (userId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notificacao WHERE id_utilizador = ?",
    [userId],
  );
  return notifications;
};

/* Função para criar notificação */
export const createNotification = async (data) => {
  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
  
  const [result] = await db.query(
    "INSERT INTO notificacao (id_utilizador, titulo, mensagem, data_envio) VALUES (?, ?, ?, ?)",
    [data.utilizadorId, data.titulo || "Notificação", data.mensagem, mysqlDateTime],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar notificação */
export const updateNotification = async (notificationId, data) => {
  const { mensagem } = data;
  const [result] = await db.query(
    "UPDATE notificacao SET mensagem=? WHERE id=?",
    [mensagem, notificationId],
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
