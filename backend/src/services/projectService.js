let projects = [];
let id = 0;

export const getAllProjects = () => {
  return projects;
};

export const createProject = (data) => {
  const project = {
    id: id++,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
  };
  projects.push(project);
  return project;
};

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

export const deleteProject = (projectId) => {
  projects = projects.filter((p) => p.id !== projectId);
};
