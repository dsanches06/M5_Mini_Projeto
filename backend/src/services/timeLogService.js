import { db } from "../db.js";

export const getAllTimeLogs = async () => {
  const [logs] = await db.query("SELECT * FROM time_log");
  return logs;
};

export const createTimeLog = async (data) => {
  const [result] = await db.query(
    "INSERT INTO time_log (task_id, user_id, hours, logged_at) VALUES (?, ?, ?, ?)",
    [data.task_id, data.user_id, data.hours, new Date()]
  );
  return { id: result.insertId, ...data };
};

export const updateTimeLog = async (id, data) => {
  const [result] = await db.query("UPDATE time_log SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTimeLog = async (id) => {
  const [result] = await db.query("DELETE FROM time_log WHERE id = ?", [id]);
  return result.affectedRows;
};
