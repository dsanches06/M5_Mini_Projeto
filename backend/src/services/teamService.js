import { db } from "../db.js";

export const getAllTeams = async () => {
  const [teams] = await db.query("SELECT * FROM team");
  return teams;
};

export const createTeam = async (data) => {
  const [result] = await db.query(
    "INSERT INTO team (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return { id: result.insertId, ...data };
};

export const updateTeam = async (id, data) => {
  const [result] = await db.query("UPDATE team SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTeam = async (id) => {
  const [result] = await db.query("DELETE FROM team WHERE id = ?", [id]);
  return result.affectedRows;
};
