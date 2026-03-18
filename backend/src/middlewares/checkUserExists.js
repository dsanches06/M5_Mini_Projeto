import * as userService from "../services/userService.js";

<<<<<<< HEAD
/* Função para verificar se o usuário existe */
=======
/*  */
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
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
