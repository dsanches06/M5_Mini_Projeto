import { ITask } from "../../tasks/index.js";
import { TaskService } from "../../services/index.js";

export async function showTasksCounters(
  type?: string,
  tasks?: ITask[],
): Promise<void> {
  if (
    (type === "tarefas" || type === "pendentes" || type === "concluídas" || type === "filtradas") &&
    tasks
  ) {
    
    await countAllTasks("#allTasksCounter", tasks.length);

    if (type === "tarefas") {
      // Para "tarefas" de um utilizador, contar pending vs completed correctamente
      const pendingCount = tasks.filter((t) => !t.getCompleted()).length;
      const completedCount = tasks.filter((t) => t.getCompleted()).length;
      await countPendingTasks("#pendingTasksCounter", pendingCount);
      await countCompletedTasks("#completedTaskCounter", completedCount);
    } else if (type === "pendentes") {
      await countPendingTasks("#pendingTasksCounter", tasks.length);
      await countCompletedTasks("#completedTaskCounter", 0);
    } else if (type === "concluídas") {
      await countCompletedTasks("#completedTaskCounter", tasks.length);
      await countPendingTasks("#pendingTasksCounter", 0);
    } else {
      await countPendingTasks("#pendingTasksCounter", tasks.length);
      await countCompletedTasks("#completedTaskCounter", tasks.length);
    }

    countFilterTasks("#filterTasksCounter", type!, tasks.length);
  } else {
    await countAllTasks("#allTasksCounter");
    await countPendingTasks("#pendingTasksCounter");
    await countCompletedTasks("#completedTaskCounter");
    countFilterTasks("#filterTasksCounter", type!);
  }
}

/* Contador de tarefas pendentes */
async function countPendingTasks(
  id: string,
  overrideValue?: number,
): Promise<void> {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (overrideValue !== undefined) {
    if (section) {
      section.textContent = `${overrideValue}`;
    }
    return;
  }
  const tasks = await TaskService.getTasks();
  if (section) {
    section.textContent = `${tasks.filter((task) => !task.getCompleted()).length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de tarefas concluídas */
async function countCompletedTasks(
  id: string,
  overrideValue?: number,
): Promise<void> {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (overrideValue !== undefined) {
    if (section) {
      section.textContent = `${overrideValue}`;
    }
    return;
  }
  const tasks = await TaskService.getTasks();
  if (section) {
    section.textContent = `${tasks.filter((task) => task.getCompleted()).length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de tarefas filtradas */
function countFilterTasks(
  id: string,
  type: string,
  count?: number,
): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    if (count !== undefined) {
      section.textContent = `${count}`;
    } else if (type === "filtradas" && section.textContent !== "") {
      section.textContent = `${0}`;
    } else {
      section.textContent = "0";
    }
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de todas as tarefas */
async function countAllTasks(
  id: string,
  overrideValue?: number,
): Promise<void> {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (overrideValue !== undefined) {
    if (section) {
      section.textContent = `${overrideValue}`;
    }
    return;
  }
  const tasks = await TaskService.getTasks();
  if (section) {
    section.textContent = `${tasks.length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}
