import { db } from "../db.js";

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
};
