import { db } from "../db.js";

/* Função para buscar todas as tags */
export const getAllTags = async () => {
  const [tags] = await db.query("SELECT * FROM tag");
  return tags;
};

/* Função para criar tag */
export const createTag = async (data) => {
  const [result] = await db.query(
    "INSERT INTO tag (nome) VALUES (?)",
    [data.nome.trim()],
  );
  return { id: result.insertId, nome: data.nome.trim() };
};

/* Função para buscar tag por ID */
export const getTagById = async (tagId) => {
  const [tags] = await db.query("SELECT * FROM tag WHERE id = ?", [tagId]);
  return tags[0];
};

/* Função para deletar tag */
export const deleteTag = async (tagId) => {
  const [result] = await db.query("DELETE FROM tag WHERE id=?", [tagId]);
  return result;
};
