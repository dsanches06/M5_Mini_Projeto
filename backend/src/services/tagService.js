import { db } from "../db.js";

/* Função para buscar todas as etiquetas */
export const getAllTags = async () => {
  try {
    const [tags] = await db.query("SELECT * FROM etiquetas");
    return tags;
  } catch (error) {
    throw error;
  }
};

/* Função para criar etiqueta */
export const createTag = async (data) => {
  try {
    const [result] = await db.query(
      "INSERT INTO etiquetas (nome) VALUES (?)",
      [data.nome.trim()],
    );
    return { id: result.insertId, nome: data.nome.trim() };
  } catch (error) {
    throw error;
  }
};

/* Função para buscar etiqueta por ID */
export const getTagById = async (tagId) => {
  try {
    const [tags] = await db.query("SELECT * FROM etiquetas WHERE id = ?", [tagId]);
    return tags[0];
  } catch (error) {
    throw error;
  }
};

/* Função para deletar etiqueta */
export const deleteTag = async (tagId) => {
  try {
    const [result] = await db.query("DELETE FROM etiquetas WHERE id=?", [tagId]);
    return result.affectedRows;
  } catch (error) {
    throw error;
  }
};
