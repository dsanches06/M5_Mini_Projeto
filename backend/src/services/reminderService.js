import { db } from "../db.js";

export const getAllReminders = async () => {
  const [reminders] = await db.query("SELECT * FROM reminder");
  return reminders;
};

export const createReminder = async (data) => {
  const [result] = await db.query(
    "INSERT INTO reminder (task_id, user_id, remind_at) VALUES (?, ?, ?)",
    [data.task_id, data.user_id || null, data.remind_at]
  );
  return { id: result.insertId, ...data };
};

export const updateReminder = async (id, data) => {
  const [result] = await db.query("UPDATE reminder SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteReminder = async (id) => {
  const [result] = await db.query("DELETE FROM reminder WHERE id = ?", [id]);
  return result.affectedRows;
};
