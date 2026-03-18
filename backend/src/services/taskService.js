import { db } from "../db.js";
<<<<<<< HEAD

/* Função para buscar todas as tarefas */
export const getAllTasks = async (search, sort) => {
  let [tasks] = await db.query("SELECT * FROM tarefa");
=======
let taskTags = [];

/* Função para  */
export const getAllTasks = (search, sort) => {
  let result = [...tasks];
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0

  if (search) {
    tasks = tasks.filter(
      (t) =>
        t.titulo.toLowerCase().includes(search.toLowerCase()) ||
        t.responsavel.toLowerCase().includes(search.toLowerCase()) ||
        t.categoria.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (sort && (sort === "asc" || sort === "desc")) {
    tasks.sort((a, b) => {
      const titleA = a.titulo.toLowerCase();
      const titleB = b.titulo.toLowerCase();

      if (sort === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });
  }

  return tasks;
};

/* Função para criar tarefa */
export const createTask = async (data) => {
  const [result] = await db.query(
    "INSERT INTO tarefa (titulo, categoria, responsavel, concluida) VALUES (?, ?, ?, ?)",
    [data.titulo, data.categoria, data.responsavel, 0],
  );
  return { id: result.insertId, ...data, concluida: 0 };
};

/* Função para atualizar tarefa */
export const updateTask = async (taskId, data) => {
  const { titulo, categoria, responsavel, concluida } = data;
  const [result] = await db.query(
    "UPDATE tarefa SET titulo=?, categoria=?, responsavel=?, concluida=? WHERE id=?",
    [titulo, categoria, responsavel, concluida, taskId],
  );
  return result;
};

<<<<<<< HEAD
/* Função para deletar tarefa */
export const deleteTask = async (taskId) => {
  await db.query("DELETE FROM tarefa_tag WHERE tarefaId=?", [taskId]);
  const [result] = await db.query("DELETE FROM tarefa WHERE id=?", [taskId]);
  return result;
};

/* Função para buscar tarefa por ID */
export const getTaskById = async (taskId) => {
  const [tasks] = await db.query("SELECT * FROM tarefa WHERE id = ?", [taskId]);
  return tasks[0];
};

/* Função para adicionar tag à tarefa */
export const addTagToTask = async (taskId, tagId) => {
  const task = await getTaskById(taskId);
=======
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
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
  if (!task) {
    throw new Error("Task not found");
  }

<<<<<<< HEAD
  const [existing] = await db.query(
    "SELECT * FROM tarefa_tag WHERE tarefaId = ? AND tagId = ?",
    [taskId, tagId],
  );
=======
  task.title = data.titulo ?? task.title;
  task.category = data.categoria ?? task.category;
  task.responsavel = data.responsavel ?? task.responsavel;
  task.completed = data.concluida ?? task.completed;
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0

  if (existing.length > 0) {
    throw new Error("Tag already associated with task");
  }

  const [result] = await db.query(
    "INSERT INTO tarefa_tag (tarefaId, tagId) VALUES (?, ?)",
    [taskId, tagId],
  );

  return { id: result.insertId, tarefaId: taskId, tagId: tagId };
};

<<<<<<< HEAD
/* Função para remover tag da tarefa */
export const removeTagFromTask = async (taskId, tagId) => {
  const [result] = await db.query(
    "DELETE FROM tarefa_tag WHERE tarefaId = ? AND tagId = ?",
    [taskId, tagId],
  );
  return result;
};

/* Função para buscar tags da tarefa */
export const getTagsByTaskId = async (taskId) => {
  const [relations] = await db.query(
    "SELECT * FROM tarefa_tag WHERE tarefaId = ?",
    [taskId],
  );
  return relations;
};

/* Função para remover tag de todas as tarefas */
export const removeTagFromAllTasks = async (tagId) => {
  const [result] = await db.query(
    "DELETE FROM tarefa_tag WHERE tagId = ?",
    [tagId],
  );
  return result;
};

/* Função para buscar estatísticas das tarefas */
export const getTaskStats = async () => {
  const tasks = await getAllTasks();
=======
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
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.concluida).length;
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
