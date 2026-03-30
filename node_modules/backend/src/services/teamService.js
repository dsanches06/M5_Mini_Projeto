import { db } from "../db.js";
import { mapTeamAPIResponse } from "../dto/mapDTO.js";

export const getAllTeams = async () => {
  const [teams] = await db.query("SELECT * FROM teams");
  return teams.map(mapTeamAPIResponse);
};

export const getTeamById = async (teamId) => {
  const [teams] = await db.query("SELECT * FROM teams WHERE id = ?", [teamId]);
  return teams.length > 0 ? mapTeamAPIResponse(teams[0]) : null;
};

export const createTeam = async (data) => {
  const [result] = await db.query(
    "INSERT INTO teams (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return mapTeamAPIResponse({ id: result.insertId, ...data });
};

export const updateTeam = async (id, data) => {
  const [result] = await db.query("UPDATE teams SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTeam = async (id) => {
  const [result] = await db.query("DELETE FROM teams WHERE id = ?", [id]);
  return result.affectedRows;
};
