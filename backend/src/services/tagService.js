import { db } from "../db.js";

<<<<<<< HEAD
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
=======
/* Função para  */
export const getAllTags = () => {
  return tags;
};

/* Função para  */
export const createTag = (data) => {
  const tag = {
    nome: data.nome.trim(),
  };
  tags.push(tag);
  return tag;
};

/* Função para  */
export const getTagById = (tagId) => {
  return tags.find((t) => t.id === tagId);
};

/* Função para  */
export const deleteTag = (tagId) => {
  const tag = tags.find((t) => t.id === tagId);
  if (!tag) {
    throw new Error("Tag not found");
  }

  tags = tags.filter((t) => t.id !== tagId);
  return tag;
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
};
