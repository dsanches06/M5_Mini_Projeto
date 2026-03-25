import { db } from "../db.js";

export const getAllTaskStatuses = async () => {
  const [statuses] = await db.query("SELECT * FROM task_status");
  return statuses;
};

export const createTaskStatus = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_status (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return { id: result.insertId, ...data };
};

export const updateTaskStatus = async (id, data) => {
  const [result] = await db.query("UPDATE task_status SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskStatus = async (id) => {
  const [result] = await db.query("DELETE FROM task_status WHERE id = ?", [id]);
  return result.affectedRows;
};
