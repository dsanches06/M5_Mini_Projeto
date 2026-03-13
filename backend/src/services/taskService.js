let tasks = [];

export const getAllTasks = (search, sort) => {
  let result = [...tasks];

  // Apply search filter if provided
  if (search) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.responsavel.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Apply sorting if provided
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

export const createTask = (data) => {
  const task = {
    id: tasks.length + 1,
    title: data.titulo,
    category: data.categoria,
    responsavel: data.responsavel,
    completed: false,
    dataConclusao: undefined,
  };

  if (task.title.length <= 3) {
    throw new Error("Title must be more than 3 characters");
  }

  if (!task.responsavel) {
    throw new Error("Responsible name cannot be empty");
  }

  tasks.push(task);
  return task;
};

export const updateTask = (taskId, data) => {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    throw new Error("Task not found");
  }

  task.title = data.titulo ?? task.titulo;
  task.category = data.categoria ?? task.categoria;
  task.responsavel = data.responsavel ?? task.responsavel;
  task.completed = data.concluida ?? task.concluida;

  if (task.completed) {
    task.dataConclusao = new Date().toISOString();
  } else {
    task.dataConclusao = undefined;
  }
  return task;
};

export const deleteTask = (taskId) => {
  tasks = tasks.filter((t) => t.id !== taskId);
};

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
