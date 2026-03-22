import { db } from "../db.js";

/* Função para buscar todas as notificações */
export const getAllNotifications = async () => {
  const [notifications] = await db.query("SELECT * FROM notificacao");
  return notifications;
};

/* Função para buscar notificação por ID */
export const getNotificationById = async (notificationId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notificacao WHERE id = ?",
    [notificationId],
  );
  return notifications[0] || null;
};

/* Função para buscar notificações por ID do usuário */
export const getNotificationsByUser = async (userId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notificacao WHERE id_utilizador = ? ORDER BY data_envio DESC",
    [userId],
  );
  return notifications;
};

/* Função para buscar notificações não lidas de um usuário */
export const getUnreadNotifications = async (userId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notificacao WHERE id_utilizador = ? AND lida = FALSE ORDER BY data_envio DESC",
    [userId],
  );
  return notifications;
};

/* Função para criar notificação */
export const createNotification = async (data) => {
  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await db.query(
    "INSERT INTO notificacao (id_utilizador, titulo, mensagem, data_envio) VALUES (?, ?, ?, ?)",
    [
      data.id_utilizador,
      data.titulo || "Notificação",
      data.mensagem,
      mysqlDateTime,
    ],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar notificação */
export const updateNotification = async (notificationId, data) => {
  const { mensagem, lida } = data;
  const result = await db.query(
    "UPDATE notificacao SET mensagem = ?, lida = ? WHERE id = ?",
    [mensagem, lida, notificationId],
  );

  return result.affectedRows;
};

export const toggleReadStatus = async (notificationId, lida) => {
  const result = await db.query(
    "UPDATE notificacao SET lida = ? WHERE id = ?",
    [lida, notificationId],
  );
  return result.affectedRows;
};

/* Função para deletar notificação */
export const deleteNotification = async (notificationId) => {
  const [result] = await db.query("DELETE FROM notificacao WHERE id=?  AND utilizador_id = ?", [
    notificationId,
    req.user.id
  ]);
  return result.affectedRows;
};
