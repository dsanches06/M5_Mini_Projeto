import { db } from "../db.js";
import { mapTimeLogAPIResponse } from "../dto/mapDTO.js";

export const getAllTimeLogs = async () => {
  const [logs] = await db.query("SELECT * FROM time_logs");
  return logs.map(mapTimeLogAPIResponse);
};

export const getTimeLogById = async (timeLogId) => {
  const [timeLogs] = await db.query("SELECT * FROM time_log WHERE id = ?", [timeLogId]);
  return timeLogs.length > 0 ? mapTimeLogAPIResponse(timeLogs[0]) : null;
};

export const createTimeLog = async (data) => {
  const [result] = await db.query(
    "INSERT INTO time_logs (task_id, user_id, hours, description, logged_at) VALUES (?, ?, ?, ?, ?)",
    [data.task_id, data.user_id, data.hours, data.description || '', new Date()]
  );
  return mapTimeLogAPIResponse({ id: result.insertId, ...data, logged_at: new Date() });
};

export const updateTimeLog = async (id, data) => {
  const [result] = await db.query("UPDATE time_logs SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTimeLog = async (id) => {
  const [result] = await db.query("DELETE FROM time_logs WHERE id = ?", [id]);
  return result.affectedRows;
};
