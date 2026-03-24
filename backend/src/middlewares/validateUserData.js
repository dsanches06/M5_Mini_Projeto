import * as userService from "../services/userService.js";

export const validateUserData = async (req, res, next) => {
  try {
    const { nome, email } = req.body;
    const isUpdate = Boolean(req.params.id || req.user?.id);

    if (isUpdate) {
      if (nome !== undefined && (typeof nome !== "string" || nome.length < 3)) {
        return res
          .status(400)
          .json({ message: "O nome deve ter no mínimo 3 caracteres" });
      }

      if (
        email !== undefined &&
        (typeof email !== "string" || !email.includes("@"))
      ) {
        return res.status(400).json({ message: "Email inválido" });
      }
    } else {
      if (!nome || typeof nome !== "string" || nome.length < 3) {
        return res
          .status(400)
          .json({ message: "O nome deve ter no mínimo 3 caracteres" });
      }

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "Email inválido" });
      }
    }

    if (email !== undefined) {
      const userId = isUpdate ? Number(req.params.id || req.user?.id) : null;
      const emailAlreadyExists = await userService.emailExists(email, userId);

      if (emailAlreadyExists) {
        const msg = isUpdate
          ? "Este email já está registrado por outro utilizador"
          : "Este email já está registrado";
        return res.status(400).json({ message: msg });
      }
    }
    next();
  } catch (error) {
    res
      .status(400)
      .json({ message: `Erro na validação de usuário: ${error.message}` });
  }
};
