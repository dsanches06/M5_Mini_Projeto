import { db } from "../db.js";

export const getAllTagTasks = async () => {
  const [tagTasks] = await db.query("SELECT * FROM tag_task");
  return tagTasks;
};

export const createTagTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO tag_task (task_id, tag_id) VALUES (?, ?)",
    [data.task_id, data.tag_id]
  );
  return { id: result.insertId, ...data };
};

export const updateTagTask = async (id, data) => {
  const [result] = await db.query("UPDATE tag_task SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTagTask = async (id) => {
  const [result] = await db.query("DELETE FROM tag_task WHERE id = ?", [id]);
  return result.affectedRows;
};
