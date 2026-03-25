import { db } from "../db.js";

export const getAllTaskStatusHistories = async () => {
  const [histories] = await db.query("SELECT * FROM task_status_history");
  return histories;
};

export const createTaskStatusHistory = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_status_history (task_id, status_id, changed_at) VALUES (?, ?, ?)",
    [data.task_id, data.status_id, new Date()]
  );
  return { id: result.insertId, ...data };
};

export const updateTaskStatusHistory = async (id, data) => {
  const [result] = await db.query("UPDATE task_status_history SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskStatusHistory = async (id) => {
  const [result] = await db.query("DELETE FROM task_status_history WHERE id = ?", [id]);
  return result.affectedRows;
};
