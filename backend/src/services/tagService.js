import { db } from "../db.js";

/* Função para buscar todas as etiquetas */
export const getAllTags = async () => {
  const [tags] = await db.query("SELECT * FROM etiquetas");
  return tags;
};

/* Função para criar etiqueta */
export const createTag = async (data) => {
  const [result] = await db.query(
    "INSERT INTO etiquetas (nome) VALUES (?)",
    [data.nome.trim()],
  );
  return { id: result.insertId, nome: data.nome.trim() };
};

/* Função para buscar etiqueta por ID */
export const getTagById = async (tagId) => {
  const [tags] = await db.query("SELECT * FROM etiquetas WHERE id = ?", [tagId]);
  return tags[0];
};

/* Função para deletar etiqueta */
export const deleteTag = async (tagId) => {
  const [result] = await db.query("DELETE FROM etiquetas WHERE id=?", [tagId]);
  return result.affectedRows;
};

/* Função para verificar se tag com mesmo nome já existe */
export const tagNameExists = async (nome, excludeTagId = null) => {
  let query = "SELECT COUNT(*) as count FROM etiquetas WHERE nome = ?";
  const params = [nome];
  
  if (excludeTagId) {
    query += " AND id != ?";
    params.push(excludeTagId);
  }
  
  const [result] = await db.query(query, params);
  return result[0].count > 0;
};
