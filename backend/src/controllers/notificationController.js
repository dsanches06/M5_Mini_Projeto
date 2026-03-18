import * as notificationService from "../services/notificationService.js";

/* Função para obter todas as notificações */
export const getNotifications = (req, res) => {
  try {
    const notifications = notificationService.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar notificações: ${error.message}` });
  }
};

/* Função para criar notificação */
export const createNotification = (req, res) => {
  try {
    const { mensagem, usuarioId } = req.body;

    if (!mensagem || mensagem.trim().length === 0) {
      return res.status(400).json({ error: "A mensagem não pode estar vazia" });
    }

    if (!usuarioId) {
      return res.status(400).json({ error: "usuarioId é obrigatório" });
    }

    const notification = notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar notificação: ${error.message}` });
  }
};

/* Função para atualizar notificação */
export const updateNotification = (req, res) => {
  try {
    const { mensagem } = req.body;

    if (mensagem !== undefined && mensagem.trim().length === 0) {
      return res.status(400).json({ error: "A mensagem não pode estar vazia" });
    }

    const notification = notificationService.updateNotification(
      Number(req.params.id),
      req.body,
    );
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: `Erro ao atualizar notificação: ${error.message}` });
  }
};

/* Função para deletar notificação */
export const deleteNotification = (req, res) => {
  try {
    notificationService.deleteNotification(Number(req.params.id));
    res.status(200).json({ message: "Notificação deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar notificação: ${error.message}` });
  }
};
