import { db } from "../db.js";

export const getAllSprintTasks = async () => {
  const [tasks] = await db.query("SELECT * FROM sprint_task");
  return tasks;
};

export const createSprintTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO sprint_task (sprint_id, task_id) VALUES (?, ?)",
    [data.sprint_id, data.task_id]
  );
  return { id: result.insertId, ...data };
};

export const updateSprintTask = async (id, data) => {
  const [result] = await db.query("UPDATE sprint_task SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteSprintTask = async (id) => {
  const [result] = await db.query("DELETE FROM sprint_task WHERE id = ?", [id]);
  return result.affectedRows;
};
