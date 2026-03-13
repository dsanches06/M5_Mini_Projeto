import * as userService from "../services/userService.js";

export const checkUserExists = (req, res, next) => {
  const userId = Number(req.params.id); 

  const user = userService.getAllUsers().find((u) => u.id === userId); 

  if (!user)
    return res.status(404).json({ error: "Utilizador não encontrado" });

  req.user = user;

  next();
};
