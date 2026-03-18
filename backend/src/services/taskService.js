import { db } from "../db.js";
let taskTags = [];

/* Função para  */
export const getAllTasks = (search, sort) => {
  let result = [...tasks];

  if (search) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.responsavel.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    result.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      if (sort === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
  }

  return result;
};

/* Função para  */
export const createTask = (data) => {
  const task = {
    title: data.titulo,
    category: data.categoria,
    responsavel: data.responsavel,
    completed: false,
    dataConclusao: undefined,
  };

  tasks.push(task);
  return task;
};

/* Função para  */
export const updateTask = (taskId, data) => {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  task.title = data.titulo ?? task.title;
  task.category = data.categoria ?? task.category;
  task.responsavel = data.responsavel ?? task.responsavel;
  task.completed = data.concluida ?? task.completed;

  if (task.completed) {
    task.dataConclusao = new Date().toISOString();
  } else {
    task.dataConclusao = undefined;
  }
  return task;
};

/* Função para  */
export const deleteTask = (taskId) => {
  tasks = tasks.filter((t) => t.id !== taskId);
  taskTags = taskTags.filter((tt) => tt.taskId !== taskId);
};

/* Função para  */
export const getTaskById = (taskId) => {
  return tasks.find((t) => t.id === taskId);
};

/* Função para  */
export const addTagToTask = (taskId, tagId) => {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  const relationExists = taskTags.some(
    (tt) => tt.taskId === taskId && tt.tagId === tagId
  );

  if (relationExists) {
    throw new Error("Tag already associated with task");
  }

  const relation = {
    taskId: taskId,
    tagId: tagId,
  };

  taskTags.push(relation);
  return relation;
};

/* Função para  */
export const removeTagFromTask = (taskId, tagId) => {
  const relationIndex = taskTags.findIndex(
    (tt) => tt.taskId === taskId && tt.tagId === tagId
  );

  if (relationIndex === -1) {
    throw new Error("Tag not associated with task");
  }

  const relation = taskTags[relationIndex];
  taskTags.splice(relationIndex, 1);
  return relation;
};

/* Função para  */
export const getTagsByTaskId = (taskId) => {
  return taskTags.filter((tt) => tt.taskId === taskId);
};

/* Função para  */
export const removeTagFromAllTasks = (tagId) => {
  taskTags = taskTags.filter((tt) => tt.tagId !== tagId);
};

/* Função para  */
export const getTaskStats = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completedPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completedPercentage: completedPercentage.toFixed(2) + "%",
  };
};
