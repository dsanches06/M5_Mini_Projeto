import { db } from "../db.js";
<<<<<<< HEAD

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
=======

/* Função para  */
export const getAllProjects = () => {
  return projects;
};

/* Função para  */
export const createProject = (data) => {
  const project = {
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
  };
  projects.push(project);
  return project;
};

/* Função para  */
export const updateProject = (projectId, data) => {
  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  project.name = data.name ?? project.name;
  project.startDate = data.startDate ?? project.startDate;
  project.endDate = data.endDate ?? project.endDate;

  return project;
};

/* Função para  */
export const deleteProject = (projectId) => {
  projects = projects.filter((p) => p.id !== projectId);
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
};
