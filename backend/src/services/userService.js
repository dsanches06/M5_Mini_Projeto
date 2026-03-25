import { db } from "../db.js";

/* Função para buscar todos os utilizadores */
export const getAllUsers = async (search, sort) => {
  let [users] = await db.query("SELECT * FROM users");

  if (search) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    users.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }
  return users;
};

/* Função para buscar utilizador por ID */
export const getUserById = async (userId) => {
  const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return users[0] || null;
};

/* Função para criar utilizador */
export const createUser = async (data) => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, phone, gender) VALUES (?, ?, ?, ?)",
    [data.name, data.email, data.phone || null, data.gender || "Male"],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar utilizador */
export const updateUser = async (userId, data) => {
  const fieldsToUpdate = [];
  const values = [];

  if (data.name !== undefined) {
    fieldsToUpdate.push("name = ?");
    values.push(data.name);
  }
  if (data.email !== undefined) {
    fieldsToUpdate.push("email = ?");
    values.push(data.email);
  }
  if (data.phone !== undefined) {
    fieldsToUpdate.push("phone = ?");
    values.push(data.phone);
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  values.push(userId);

  const [result] = await db.query(
    `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`,
    values,
  );
  return result.affectedRows;
};

/* Função para deletar utilizador */
export const deleteUser = async (userId) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);
  return result.affectedRows;
};

/* Função para alternar status ativo/inativo do utilizador */
export const toggleUserActive = async (userId, data) => {
  const [result] = await db.query(
    "UPDATE users SET active = ? WHERE id = ?",
    [data.active, userId],
  );
  return result.affectedRows;
};

/* Função para verificar se email existe */
export const emailExists = async (email, userId = null) => {
  let query = "SELECT * FROM users WHERE email = ?";
  const params = [email];

  if (userId) {
    query += " AND id != ?";
    params.push(userId);
  }

  const [users] = await db.query(query, params);
  return users.length > 0;
};

/* Função para buscar estatísticas dos utilizadores */
export const getUserStats = async () => {
  const [result] = await db.query("SELECT COUNT(*) as totalUsers FROM users");
  const totalUsers = result[0].totalUsers;

  const [activeResult] = await db.query("SELECT COUNT(*) as activeUsers FROM users WHERE active = 1");
  const activeUsers = activeResult[0].activeUsers;
  const [inactiveResult] = await db.query("SELECT COUNT(*) as inactiveUsers FROM users WHERE active = 0");
  const inactiveUsers = inactiveResult[0].inactiveUsers;

  const activePercentage = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : "0.00";
  const inactivePercentage = totalUsers > 0 ? ((inactiveUsers / totalUsers) * 100).toFixed(2) : "0.00";

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    activePercentage: activePercentage + "%",
    inactivePercentage: inactivePercentage + "%",
  };
};
