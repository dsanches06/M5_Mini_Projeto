import { db } from "../db.js";

/* Função para buscar todos os projetos */
export const getAllProjects = async (search, sort) => {
  let [projects] = await db.query("SELECT * FROM projeto");

  if (search) {
    projects = projects.filter(
      (p) =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.descricao.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    projects.sort((a, b) => {
      const nameA = a.nome.toLowerCase();
      const nameB = b.nome.toLowerCase();

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
    "INSERT INTO projeto (nome, descricao, dataInicio, dataFim) VALUES (?, ?, ?, ?)",
    [data.nome, data.descricao, data.dataInicio, data.dataFim],
  );
  return { id: result.insertId, ...data };
};

/* Função para atualizar projeto */
export const updateProject = async (projectId, data) => {
  const { nome, descricao, dataInicio, dataFim } = data;
  const [result] = await db.query(
    "UPDATE projeto SET nome=?, descricao=?, dataInicio=?, dataFim=? WHERE id=?",
    [nome, descricao, dataInicio, dataFim, projectId],
  );
  return result;
};

/* Função para deletar projeto */
export const deleteProject = async (projectId) => {
  const [result] = await db.query("DELETE FROM projeto WHERE id=?", [projectId]);
  return result;
};
