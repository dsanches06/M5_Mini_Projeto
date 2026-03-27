import { db } from "../db.js";
import { mapFavoriteTaskAPIResponse } from "../dto/mapDTO.js";

export const getAllFavoriteTasks = async () => {
  const [favorites] = await db.query("SELECT * FROM favorite_task");
  return favorites.map(mapFavoriteTaskAPIResponse);
};

export const createFavoriteTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO favorite_task (task_id, user_id) VALUES (?, ?)",
    [data.task_id, data.user_id]
  );
  return mapFavoriteTaskAPIResponse({ id: result.insertId, ...data });
};

export const updateFavoriteTask = async (id, data) => {
  const [result] = await db.query("UPDATE favorite_task SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteFavoriteTask = async (id) => {
  const [result] = await db.query("DELETE FROM favorite_task WHERE id = ?", [id]);
  return result.affectedRows;
};
