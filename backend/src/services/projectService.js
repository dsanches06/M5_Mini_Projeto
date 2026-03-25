import { db } from "../db.js";

/* Função para buscar todos os projetos */
export const getAllProjects = async (search, sort) => {
  let [projects] = await db.query("SELECT * FROM project");

  if (search) {
    projects = projects.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    projects.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sort === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  return projects;
};

/* Função para criar novo projeto */
export const createProject = async (data) => {
  const [result] = await db.query(
    "INSERT INTO project (name, description, start_date, end_date_expected) VALUES (?, ?, ?, ?)",
    [data.name, data.description, data.start_date, data.end_date_expected],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar projeto */
export const updateProject = async (projectId, data) => {
  const { name, description, start_date, end_date_expected } = data;
  const [result] = await db.query(
    "UPDATE project SET name=?, description=?, start_date=?, end_date_expected=? WHERE id=?",
    [name, description, start_date, end_date_expected, projectId],
  );
  return result.affectedRows;
};

/* Função para deletar projeto */
export const deleteProject = async (projectId) => {
  const [result] = await db.query("DELETE FROM project WHERE id=?", [projectId]);
  return result.affectedRows;
};
