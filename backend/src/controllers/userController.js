import * as userService from "../services/userService.js";

/* Função para buscar usuários */
export const getUsers = async (req, res) => {
  try {
    const { sort, search } = req.query;
    const users = await userService.getAllUsers(search, sort);
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: `Erro ao buscar usuários: ${error.message}` });
  }
};

/* Função para criar usuário */
export const createUser = async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || nome.length < 3) {
      return res.status(400).json({ message: "O nome deve ter no mínimo 3 caracteres" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Email inválido" });
    }

    const emailAlreadyExists = await userService.emailExists(email);
    if (emailAlreadyExists) {
      return res.status(400).json({ message: "Este email já está registrado" });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: `Erro ao criar usuário: ${error.message}` });
  }
};

/* Função para atualizar usuário */
export const updateUser = async (req, res) => {
  try {
    const { nome, email } = req.body;
    const userId = req.params.id || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "ID do utilizador não fornecido" });
    }

    if (nome !== undefined && (nome.length === 0 || nome.length < 3)) {
      return res.status(400).json({ message: "O nome deve ter no mínimo 3 caracteres" });
    }

    if (email !== undefined && (email.length === 0 || !email.includes("@"))) {
      return res.status(400).json({ message: "Email inválido" });
    }

    if (email !== undefined) {
      const emailAlreadyExists = await userService.emailExists(email, Number(userId));
      if (emailAlreadyExists) {
        return res.status(400).json({ message: "Este email já está registrado por outro utilizador" });
      }
    }

    const affectedRows = await userService.updateUser(Number(userId), req.body);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: `O utilizador com id ${userId} não foi encontrado`,
      });
    }

    res.json({ message: "Dados do utilizador atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: `Erro ao atualizar utilizador: ${error.message}` });
  }
};

/* Função para deletar utilizador */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: "ID do utilizador não fornecido" });
    }

    const affectedRows = await userService.deleteUser(Number(userId));

    if (affectedRows === 0) {
      return res.status(404).json({
        message: `O utilizador com id ${userId} não foi encontrado`,
      });
    }

    res.status(200).json({ message: "Utilizador removido com sucesso" });
  } catch (error) {
    res.status(400).json({ message: `Erro ao deletar utilizador: ${error.message}` });
  }
};

/* Função para alternar status ativo/inativo do utilizador */
export const toggleUserActive = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.id;
    
    if (!userId) {
      return res.status(400).json({ message: "ID do utilizador não fornecido" });
    }

    const affectedRows = await userService.toggleUserActive(Number(userId), req.body);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: `O utilizador com id ${userId} não foi encontrado`,
      });
    }
    res.json({ message: "Status do utilizador alterado com sucesso" });
  } catch (error) {
    res.status(400).json({ message: `Erro ao alternar status: ${error.message}` });
  }
};

/* Função para buscar estatísticas dos utilizadores */
export const getStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: `Erro ao buscar estatísticas: ${error.message}` });
  }
};

/* Função para obter notificações não lidas */
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    const notifications = await userService.getUnreadNotifications(Number(userId));
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: `Erro ao buscar notificações: ${error.message}` });
  }
};

/* Função para obter notificações do utilizador */
export const getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user?.id;
    const notifications = await userService.getNotificationsByUser(Number(userId));
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: `Erro ao buscar notificações: ${error.message}` });
  }
};

/* Função para marcar notificação como lida */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.params.id || req.user?.id;
    
    const affectedRows = await userService.markNotificationAsRead(Number(notificationId));
    
    if (affectedRows === 0) {
      return res.status(404).json({
        message: `Notificação com id ${notificationId} não foi encontrada`,
      });
    }

    res.json({ message: "Notificação marcada como lida" });
  } catch (error) {
    res.status(400).json({ message: `Erro ao marcar notificação como lida: ${error.message}` });
  }
};
