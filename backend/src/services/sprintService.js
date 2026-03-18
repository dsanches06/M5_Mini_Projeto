import { db } from "../db.js";
<<<<<<< HEAD

/* Função para buscar todas as sprints */
export const getAllSprints = async (search, sort) => {
  let [sprints] = await db.query("SELECT * FROM sprint");

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
    "INSERT INTO sprint (nome, dataInicio, dataFim) VALUES (?, ?, ?)",
    [data.nome, data.dataInicio, data.dataFim],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar sprint */
export const updateSprint = async (sprintId, data) => {
  const { nome, dataInicio, dataFim } = data;
  const [result] = await db.query(
    "UPDATE sprint SET nome=?, dataInicio=?, dataFim=? WHERE id=?",
    [nome, dataInicio, dataFim, sprintId],
  );
  return result;
};

/* Função para deletar sprint */
export const deleteSprint = async (sprintId) => {
  const [result] = await db.query("DELETE FROM sprint WHERE id=?", [sprintId]);
  return result;
=======

/* Função para  */
export const getAllSprints = () => {
  return sprints;
};

/* Função para  */
export const createSprint = (data) => {
  const sprint = {
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
  };
  sprints.push(sprint);
  return sprint;
};

/* Função para  */
export const updateSprint = (sprintId, data) => {
  const sprint = sprints.find((s) => s.id === sprintId);
  if (!sprint) {
    throw new Error("Sprint not found");
  }

  sprint.name = data.name ?? sprint.name;
  sprint.startDate = data.startDate ?? sprint.startDate;
  sprint.endDate = data.endDate ?? sprint.endDate;

  return sprint;
};

/* Função para  */
export const deleteSprint = (sprintId) => {
  sprints = sprints.filter((s) => s.id !== sprintId);
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
};
