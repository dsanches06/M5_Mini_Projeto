import { db } from "../db.js";

export const getAllTaskVotes = async () => {
  const [votes] = await db.query("SELECT * FROM task_vote");
  return votes;
};

export const createTaskVote = async (data) => {
  const [result] = await db.query(
    "INSERT INTO task_vote (task_id, user_id, vote_type) VALUES (?, ?, ?)",
    [data.task_id, data.user_id, data.vote_type]
  );
  return { id: result.insertId, ...data };
};

export const updateTaskVote = async (id, data) => {
  const [result] = await db.query("UPDATE task_vote SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteTaskVote = async (id) => {
  const [result] = await db.query("DELETE FROM task_vote WHERE id = ?", [id]);
  return result.affectedRows;
};
