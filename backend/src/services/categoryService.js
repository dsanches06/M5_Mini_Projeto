import { db } from "../db.js";

export const getAllCategories = async () => {
  const [categories] = await db.query("SELECT * FROM category");
  return categories;
};

export const createCategory = async (data) => {
  const [result] = await db.query(
    "INSERT INTO category (name, description) VALUES (?, ?)",
    [data.name, data.description]
  );
  return { id: result.insertId, ...data };
};

export const updateCategory = async (id, data) => {
  const [result] = await db.query("UPDATE category SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteCategory = async (id) => {
  const [result] = await db.query("DELETE FROM category WHERE id = ?", [id]);
  return result.affectedRows;
};
