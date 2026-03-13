let sprints = [];
let id = 0;

export const getAllSprints = () => {
  return sprints;
};

export const createSprint = (data) => {
  const sprint = {
    id: id++,
    name: data.name,
    startDate: data.startDate,
    endDate: data.endDate,
  };
  sprints.push(sprint);
  return sprint;
};

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

export const deleteSprint = (sprintId) => {
  sprints = sprints.filter((s) => s.id !== sprintId);
};
