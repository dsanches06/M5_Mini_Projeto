import { db } from "../db.js";

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
};
