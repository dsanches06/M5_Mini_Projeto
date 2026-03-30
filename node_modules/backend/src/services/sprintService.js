import { db } from "../db.js";
import { mapSprintAPIResponse } from "../dto/mapDTO.js";

/* Função para buscar todas as sprints */
export const getAllSprints = async (search, sort) => {
  let [sprints] = await db.query("SELECT * FROM sprints");

  if (search) {
    sprints = sprints.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    sprints.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return sprints.map(mapSprintAPIResponse);
};

/* Função para buscar uma sprint por ID */
export const getSprintById = async (sprintId) => {
  const [sprints] = await db.query("SELECT * FROM sprints WHERE id = ?", [sprintId]);
  return sprints.length > 0 ? mapSprintAPIResponse(sprints[0]) : null;
};

/* Função para criar sprint */
export const createSprint = async (data) => {
  const [result] = await db.query(
    "INSERT INTO sprints (project_id, name, description, start_date, end_date, status_id) VALUES (?, ?, ?, ?, ?, ?)",
    [data.project_id, data.name, data.description, data.start_date, data.end_date, data.status_id],
  );
  return mapSprintAPIResponse({ id: result.insertId, ...data });
};

/* Função para atualizar sprint */
export const updateSprint = async (sprintId, data) => {
  const { project_id, name, description, start_date, end_date, status_id } = data;
  const [result] = await db.query(
    "UPDATE sprints SET project_id=?, name=?, description=?, start_date=?, end_date=?, status_id=? WHERE id=?",
    [project_id, name, description, start_date, end_date, status_id, sprintId],
  );
  return result.affectedRows;
};

/* Função para deletar sprint */
export const deleteSprint = async (sprintId) => {
  const [result] = await db.query("DELETE FROM sprints WHERE id=?", [sprintId]);
  return result.affectedRows;
};
