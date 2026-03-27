import { db } from "../db.js";
import { mapPriorityAPIResponse } from "../dto/mapDTO.js";

export const getAllPriorities = async () => {
  const [priorities] = await db.query("SELECT * FROM priority");
  return priorities.map(mapPriorityAPIResponse);
};

export const getPriorityById = async (priorityId) => {
  const [priorities] = await db.query("SELECT * FROM priority WHERE id = ?", [priorityId]);
  return priorities.length > 0 ? mapPriorityAPIResponse(priorities[0]) : null;
};

export const createPriority = async (data) => {
  const [result] = await db.query(
    "INSERT INTO priority (name, priority_level) VALUES (?, ?)",
    [data.name, data.priority_level]
  );
  return mapPriorityAPIResponse({ id: result.insertId, ...data });
};

export const updatePriority = async (id, data) => {
  const [result] = await db.query("UPDATE priority SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deletePriority = async (id) => {
  const [result] = await db.query("DELETE FROM priority WHERE id = ?", [id]);
  return result.affectedRows;
};
