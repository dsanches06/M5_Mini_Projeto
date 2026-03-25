import { db } from "../db.js";

export const getAllTeamMembers = async () => {
  const [members] = await db.query("SELECT * FROM team_members");
  return members;
};

export const createTeamMember = async (data) => {
  const [result] = await db.query(
    "INSERT INTO team_members (team_id, user_id) VALUES (?, ?)",
    [data.team_id, data.user_id]
  );
  return { id: result.insertId, ...data };
};

export const updateTeamMember = async (id, data) => {
  const [result] = await db.query("UPDATE team_members SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTeamMember = async (id) => {
  const [result] = await db.query("DELETE FROM team_members WHERE id = ?", [id]);
  return result.affectedRows;
};
