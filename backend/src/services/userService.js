import { db } from "../db.js";

/* Função para buscar todos os usuários */
export const getAllUsers = async (search, sort) => {
  let [users] = await db.query("SELECT * FROM utilizador");

  if (search) {
    users = users.filter(
      (u) =>
        u.nome.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    users.sort((a, b) => {
      const nameA = a.nome.toLowerCase();
      const nameB = b.nome.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return users;
};

/* Função para criar usuário */
export const createUser = async (data) => {
  const [result] = await db.query(
    "INSERT INTO utilizador (nome, email, telefone) VALUES (?, ?, ?)",
    [data.nome, data.email, data.telefone],
  );
  return { id: result.insertId, ...data };
};

/* Função para buscar usuário por ID */
export const getUserById = async (userId) => {
  const [users] = await db.query("SELECT * FROM utilizador WHERE id = ?", [
    userId,
  ]);
  return users[0];
};

/* Função para atualizar usuário */
export const updateUser = async (userId, data) => {
  const { nome, email, telefone } = data;
  const [result] = await db.query(
    "UPDATE utilizador SET nome=?, email=?, telefone=? WHERE id=?",
    [nome, email, telefone, userId],
  );
  return result;
};

/* Função para alternar status ativo/inativo do usuário */
export const toggleUserActive = async (userId, data) => {
  const [result] = await db.query(
    "UPDATE utilizador SET activo = ? WHERE id = ?",
    [data.activo, userId],
  );
  return result;
};

/* Função para deletar usuário */
export const deleteUser = async (userId) => {
  const [result] = await db.query("DELETE FROM utilizador WHERE id=?", [userId]);
  return result;
};

/* Função para buscar estatísticas dos usuários */
export const getUserStats = async () => {
  const users = await getAllUsers();
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.activo).length;
  const inactiveUsers = totalUsers - activeUsers;
  const activePercentage =
    totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    activePercentage: activePercentage.toFixed(2) + "%",
  };
};
