import { db } from "../db.js";
import { mapTeamAPIResponse } from "../dto/mapDTO.js";

export const getAllTeams = async () => {
  try {
    console.log("🔍 Query: SELECT * FROM teams");
    const [teams] = await db.query("SELECT * FROM teams");
    console.log(`📊 Resultado: ${teams.length} teams`);
    const mapped = teams.map(mapTeamAPIResponse);
    console.log("✅ Teams mapeados:", mapped);
    return mapped;
  } catch (error) {
    console.error("❌ Erro na query de teams:", error);
    throw error;
  }
};

export const createTeam = async (data) => {
  const [result] = await db.query(
    "INSERT INTO team (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return mapTeamAPIResponse({ id: result.insertId, ...data });
};

export const updateTeam = async (id, data) => {
  const [result] = await db.query("UPDATE team SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTeam = async (id) => {
  const [result] = await db.query("DELETE FROM team WHERE id = ?", [id]);
  return result.affectedRows;
};
