import { db } from "../db.js";

/* Função para buscar todas as etiquetas */
export const getAllTags = async () => {
  const [tags] = await db.query("SELECT * FROM tags");
  return tags;
};

/* Função para criar etiqueta */
export const createTag = async (data) => {
  const [result] = await db.query(
    "INSERT INTO tags (name) VALUES (?)",
    [data.name.trim()],
  );
  return { id: result.insertId, name: data.name.trim() };
};

/* Função para buscar etiqueta por ID */
export const getTagById = async (tagId) => {
  const [tags] = await db.query("SELECT * FROM tags WHERE id = ?", [tagId]);
  return tags[0];
};

/* Função para deletar etiqueta */
export const deleteTag = async (tagId) => {
  const [result] = await db.query("DELETE FROM tags WHERE id=?", [tagId]);
  return result.affectedRows;
};

/* Função para verificar se tag com mesmo nome já existe */
export const tagNameExists = async (nome, excludeTagId = null) => {
  let query = "SELECT COUNT(*) as count FROM tags WHERE name = ?";
  const params = [nome];
  
  if (excludeTagId) {
    query += " AND id != ?";
    params.push(excludeTagId);
  }
  
  const [result] = await db.query(query, params);
  return result[0].count > 0;
};
