import * as userService from "./backend/src/services/userService.js";

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

    // Validação de email com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    // Verificar se é erro de email duplicado
    if (error.message.includes("Duplicate entry") || error.message.includes("email")) {
      return res.status(400).json({ message: "Este email já está registado" });
    }
    res.status(400).json({ message: `Erro ao criar utilizador: ${error.message}` });
  }
};

/* Função para atualizar utilizador */
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

    // Validação de email com regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== undefined && (email.length === 0 || !emailRegex.test(email))) {
      return res.status(400).json({ message: "Email inválido" });
    }

    const affectedRows = await userService.updateUser(Number(userId), req.body);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: `O utilizador com id ${userId} não foi encontrado`,
      });
    }

    res.json({ message: "Dados do utilizador atualizado com sucesso" });
  } catch (error) {
    // Verificar se é erro de email duplicado
    if (error.message.includes("Duplicate entry") || error.message.includes("email")) {
      return res.status(400).json({ message: "Este email já está registado" });
    }
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
