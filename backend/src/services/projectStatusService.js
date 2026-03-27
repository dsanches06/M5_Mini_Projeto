import { db } from "../db.js";
import { mapProjectStatusAPIResponse } from "../dto/mapDTO.js";

export const getAllProjectStatuses = async () => {
  const [statuses] = await db.query("SELECT * FROM project_status");
  return statuses.map(mapProjectStatusAPIResponse);
};

export const createProjectStatus = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project_status (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return mapProjectStatusAPIResponse({ id: result.insertId, ...data });
};

export const updateProjectStatus = async (id, data) => {
  const [result] = await db.query("UPDATE project_status SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteProjectStatus = async (id) => {
  const [result] = await db.query("DELETE FROM project_status WHERE id = ?", [id]);
  return result.affectedRows;
};
