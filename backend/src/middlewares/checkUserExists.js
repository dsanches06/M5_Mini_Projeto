import * as userService from "../services/userService.js";

/* Função para verificar se o usuário existe */
export const checkUserExists = (req, res, next) => {
  // Se não houver ID nos parâmetros, continua sem validar
  if (!req.params.id) {
    return next();
  }

  const userId = Number(req.params.id);
  const user = userService.getAllUsers().find((u) => u.id === userId);

  if (!user)
    return res.status(404).json({ error: "Utilizador não encontrado" });

  req.user = user;
  next();
};
