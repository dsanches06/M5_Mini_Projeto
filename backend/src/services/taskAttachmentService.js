import { db } from "../db.js";

export const getAllTaskAttachments = async () => {
  const [attachments] = await db.query("SELECT * FROM task_attachment");
  return attachments;
};

export const createTaskAttachment = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_attachment (task_id, file_name, file_path) VALUES (?, ?, ?)",
    [data.task_id, data.file_name, data.file_path]
  );
  return { id: result.insertId, ...data };
};

export const updateTaskAttachment = async (id, data) => {
  const [result] = await db.query("UPDATE task_attachment SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskAttachment = async (id) => {
  const [result] = await db.query("DELETE FROM task_attachment WHERE id = ?", [id]);
  return result.affectedRows;
};
