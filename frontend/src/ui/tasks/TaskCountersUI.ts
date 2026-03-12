import { ITask } from "../../tasks/index.js";

export function showTasksCounters(filteredTask: ITask[], type?: string): void {
  countAllTasks("#allTasksCounter", filteredTask);
  countCompletedTasks("#completedTaskCounter", filteredTask);
  countPendingTasks("#pendingTasksCounter", filteredTask);
  countFilterTasks("#filterTasksCounter", type!, filteredTask);
}

/* Contador de tarefas pendentes de todos os utilizadores */
export function countPendingTasks(id: string, tasksList: ITask[]): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    section.textContent = `${tasksList.filter((task) => !task.getCompleted()).length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de tarefas terminadas de todos os utilizadores */
export function countCompletedTasks(id: string, tasksList: ITask[]): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    section.textContent = `${tasksList.filter((task) => task.getCompleted()).length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de tasks filtrados por nome*/
export function countFilterTasks(
  id: string,
  type: string,
  tasksList: ITask[],
): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    if (type === "filtered" && tasksList && tasksList.length > 0) {
      section.textContent = `${tasksList.length}`;
    } else {
      section.textContent = "0";
    }
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de tarefas de todos os utilizadores */
export function countAllTasks(id: string, tasksList: ITask[]): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    section.textContent = `${tasksList.length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}
