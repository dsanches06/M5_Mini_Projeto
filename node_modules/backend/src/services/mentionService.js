import { db } from "../db.js";
import { mapMentionAPIResponse } from "../dto/mapDTO.js";

export const getAllMentions = async () => {
  const [mentions] = await db.query("SELECT * FROM mention");
  return mentions.map(mapMentionAPIResponse);
};

export const getMentionById = async (mentionId) => {
  const [mentions] = await db.query("SELECT * FROM mention WHERE id = ?", [mentionId]);
  return mentions.length > 0 ? mapMentionAPIResponse(mentions[0]) : null;
};

export const createMention = async (data) => {
  const [result] = await db.query(
    "INSERT INTO mention (task_id, user_id, mentioned_at) VALUES (?, ?, ?)",
    [data.task_id, data.user_id, new Date()]
  );
  return mapMentionAPIResponse({ id: result.insertId, ...data });
};

export const updateMention = async (id, data) => {
  const [result] = await db.query("UPDATE mention SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteMention = async (id) => {
  const [result] = await db.query("DELETE FROM mention WHERE id = ?", [id]);
  return result.affectedRows;
};
