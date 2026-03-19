import { db } from "../db.js";

/* Função para buscar todas as sprints */
export const getAllSprints = async (search, sort) => {
  let [sprints] = await db.query("SELECT * FROM sprints");

  if (search) {
    sprints = sprints.filter(
      (s) => s.nome.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    sprints.sort((a, b) => {
      const nameA = a.nome.toLowerCase();
      const nameB = b.nome.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return sprints;
};

/* Função para criar sprint */
export const createSprint = async (data) => {
  const [result] = await db.query(
    "INSERT INTO sprints (nome, data_inicio, data_fim) VALUES (?, ?, ?)",
    [data.nome, data.dataInicio, data.dataFim],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar sprint */
export const updateSprint = async (sprintId, data) => {
  const { nome, dataInicio, dataFim } = data;
  const [result] = await db.query(
    "UPDATE sprints SET nome=?, data_inicio=?, data_fim=? WHERE id=?",
    [nome, dataInicio, dataFim, sprintId],
  );
  return result;
};

/* Função para deletar sprint */
export const deleteSprint = async (sprintId) => {
  const [result] = await db.query("DELETE FROM sprints WHERE id=?", [sprintId]);
  return result;
};
