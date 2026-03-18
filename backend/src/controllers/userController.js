import * as userService from "../services/userService.js";
import * as notificationService from "../services/notificationService.js";

/* Função para buscar usuários */
export const getUsers = async (req, res) => {
  const { sort, search } = req.query;
  const users = await userService.getAllUsers(search, sort);
  res.json(users);
};

<<<<<<< HEAD
/* Função para criar usuário */
export const createUser = async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || nome.length < 3) {
      return res.status(400).json({ error: "O nome deve ter no mínimo 3 caracteres" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar usuário: ${error.message}` });
  }
};

/* Função para atualizar usuário */
export const updateUser = async (req, res) => {
  try {
    const { nome, email } = req.body;

    if (nome !== undefined && nome.length < 3) {
      return res.status(400).json({ error: "O nome deve ter no mínimo 3 caracteres" });
    }

    if (email !== undefined && !email.includes("@")) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const result = await userService.updateUser(Number(req.params.id), req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `O usuário com id ${Number(req.params.id)} não foi encontrado`,
      });
    }

    res.json({ message: "Dados do usuário atualizado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: `Erro ao atualizar usuário: ${error.message}` });
=======
export const createUser = (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || name.length < 3) {
      return res.status(400).json({
        error: `O nome ${name} tem que ter 3 caracteres no minimo!`,
      });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        error: `O email ${email} é inválido!`,
      });
    }

    const user = userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = (req, res) => {
  try {
    const { name, email } = req.body;

    if (name !== undefined && name.length < 3) {
      return res.status(400).json({
        error: `O nome ${name} tem que ter 3 caracteres no minimo!`,
      });
    }

    if (email !== undefined && !email.includes("@")) {
      return res.status(400).json({
        error: `O email ${email} é inválido!`,
      });
    }

    const user = userService.updateUser(Number(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
  }
};

/* Função para deletar usuário */
export const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(Number(req.params.id));

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `O usuário com id ${Number(req.params.id)} não foi encontrado`,
      });
    }

    res.status(200).json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    res.status(400).json({ error: `Erro ao deletar usuário: ${error.message}` });
  }
};

<<<<<<< HEAD
/* Função para alternar status ativo/inativo do usuário */
export const toggleUserActive = async (req, res) => {
  try {
    const result = await userService.toggleUserActive(Number(req.params.id), req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `O usuário com id ${Number(req.params.id)} não foi encontrado`,
      });
    }

    res.json({ message: "Status do usuário alterado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: `Erro ao alternar status: ${error.message}` });
  }
};

/* Função para buscar estatísticas dos usuários */
export const getStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: `Erro ao buscar estatísticas: ${error.message}` });
  }
};

/* Função para buscar notificações de um usuário */
export const getNotifications = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    
    if (!userId || userId <= 0) {
      return res.status(400).json({ error: "ID de usuário inválido" });
    }

    const notifications = await userService.getNotificationsByUserId(userId);
    
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: "Nenhuma notificação encontrada para este usuário" });
    }

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar notificações: ${error.message}` });
=======
export const toggleUserActive = (req, res) => {
  const user = userService.toggleUserActive(Number(req.params.id));
  res.json(user);
};

export const getStats = (req, res) => {
  const stats = userService.getUserStats();
  res.json(stats);
};

export const getNotifications = (req, res) => {
  try {
    const userId = Number(req.params.id);
    const notifications = notificationService.getNotificationsByUserId(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
  }
};
