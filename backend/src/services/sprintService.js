import { db } from "../db.js";

/* Função para buscar todas as sprints */
export const getAllSprints = async (search, sort) => {
  let [sprints] = await db.query("SELECT * FROM sprints");

  if (search) {
    sprints = sprints.filter(
      (s) => s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    sprints.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

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
    "INSERT INTO sprints (name, start_date, end_date) VALUES (?, ?, ?)",
    [data.name, data.start_date, data.end_date],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar sprint */
export const updateSprint = async (sprintId, data) => {
  const { name, start_date, end_date } = data;
  const [result] = await db.query(
    "UPDATE sprints SET name=?, start_date=?, end_date=? WHERE id=?",
    [name, start_date, end_date, sprintId],
  );
  return result.affectedRows;
};

/* Função para deletar sprint */
export const deleteSprint = async (sprintId) => {
  const [result] = await db.query("DELETE FROM sprints WHERE id=?", [sprintId]);
  return result.affectedRows;
};
