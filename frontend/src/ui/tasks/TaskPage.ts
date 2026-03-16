import { IUser } from "../../models/index.js";
import { ITask } from "../../tasks/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { showTasksCounters } from "./index.js";
import { renderTaskModal } from "../modal/index.js";
import {
  removeAllCompletedTask,
  searchTasksByTitle,
  sortTasksByTitle,
} from "../gestUserTask/index.js";
import {
  addElementInContainer,
  createSection,
  menuSelected,
  createHeadingTitle,
  createStatisticsCounter,
  createSearchContainer,
  clearContainer,
} from "../dom/index.js";
import { TaskService } from "../../services/taskService.js";
import { createNotificationsUI } from "../notifications/notificationsUI.js";
import { renderDashboard } from "../dashboard/RenderDashBoardUI.js";

/* Lista de tarefas  */
export function loadTasksPage(user?: IUser): void {
  /* ativa o menu tarefas */
  menuSelected("#menuTasks");

  const tasks = user ? user.getTasks() : TaskService.getAllTasks();
  const title = user ? `Tarefas de ${user.getName()}` : "GESTÃO DE TAREFAS";

  clearContainer("#containerSection");

  if (user) {
    addElementInContainer("#containerSection", createNotificationsUI());
  }

  addElementInContainer("#containerSection", createHeadingTitle("h2", title));

  const taskCounterSection = createTaskCounter("taskCounters") as HTMLElement;
  addElementInContainer("#containerSection", taskCounterSection);

  showTasksCounters(tasks);

  const searchContainer = showSearchTaskContainer();
  addElementInContainer("#containerSection", searchContainer);

  //dashboard de tarefas
  renderDashboard(tasks, user);

  // Adicionar event listeners aos botões de contador para filtrar
  const allTasksBtn = taskCounterSection.querySelector(
    "#allTasksBtn",
  ) as HTMLElement;
  allTasksBtn.title = "Mostrar todas as tarefas";
  const pendingTaskBtn = taskCounterSection.querySelector(
    "#pendingTaskBtn",
  ) as HTMLElement;
  pendingTaskBtn.title = "Mostrar tarefas pendentes";
  const completedTaskBtn = taskCounterSection.querySelector(
    "#completedTaskBtn",
  ) as HTMLElement;
  completedTaskBtn.title = "Mostrar tarefas concluídas";

  allTasksBtn.addEventListener("click", () => {
    renderDashboard(tasks, user);
  });

  pendingTaskBtn.addEventListener("click", () => {
    const tasksPending = tasks.filter((task) => !task.getCompleted());
    renderDashboard(tasksPending, user);
  });

  completedTaskBtn.addEventListener("click", () => {
    const tasksCompleted = tasks.filter((task) => task.getCompleted());
    renderDashboard(tasksCompleted, user);
  });

  const addTasksBtn = document.querySelector("#addTasksBtn") as HTMLElement;
  if (addTasksBtn) {
    addTasksBtn.addEventListener("click", () => {
      renderTaskModal();
    });
  } else {
    console.warn("Elemento #addTasksBtn não foi renderizado no DOM.");
  }

  const sortTasksBtn = document.querySelector("#sortTasksBtn") as HTMLElement;
  if (sortTasksBtn) {
    let isAscending = true;
    sortTasksBtn.addEventListener("click", () => {
      const sortedTasks = sortTasksByTitle(tasks, isAscending);
      isAscending = !isAscending;
      renderDashboard(sortedTasks, user, "filtered");
      sortTasksBtn.textContent = isAscending ? "Ordenar A-Z" : "Ordenar Z-A";
    });
  } else {
    console.warn("Elemento #sortTasksBtn não foi renderizado no DOM.");
  }

  // Adicionar event listeners aos botões de busca
  const searchTaskInput = document.querySelector(
    "#searchTask",
  ) as HTMLInputElement;
  if (searchTaskInput) {
    searchTaskInput.addEventListener("input", () => {
      const searchTerm = searchTaskInput.value;
      const filteredTasks = searchTasksByTitle(tasks, searchTerm);
      renderDashboard(filteredTasks, user, "filtered");
    });
  } else {
    console.warn("Elemento de busca de tarefas não encontrado.");
  }

  // Adicionar event listeners aos botões de busca
  const removeAllCompletedTaskBtn = document.querySelector(
    "#removeAllCompletedTaskBtn",
  ) as HTMLElement;

  if (removeAllCompletedTaskBtn) {
    removeAllCompletedTaskBtn.addEventListener("click", () => {
      const removedTasks = removeAllCompletedTask(tasks);

      if (removedTasks.length > 0) {
        const completedTaskCount = removedTasks.filter((task) =>
          task.getCompleted(),
        ).length;
        if (completedTaskCount <= 0) {
          showInfoBanner(
            "Não há tarefa concluída para remover.",
            "error-banner",
          );
        }
        renderDashboard(removedTasks, user);
      } else {
        showInfoBanner("Não há tarefa concluída para remover.", "error-banner");
      }
    });
  }
}
/* */
function createTaskCounter(id: string): HTMLElement {
  //
  const allTasksBtn = createStatisticsCounter(
    "allTaskSection",
    "allTasksBtn",
    "./src/assets/tarefa.png",
    "tarefas",
    "allTasksCounter",
  ) as HTMLElement;

  //
  const pendingTaskBtn = createStatisticsCounter(
    "pendingTaskSection",
    "pendingTaskBtn",
    "./src/assets/pendente.png",
    "pendentes",
    "pendingTasksCounter",
  ) as HTMLElement;
  //
  const completedTaskBtn = createStatisticsCounter(
    "completedTaskSection",
    "completedTaskBtn",
    "./src/assets/tarefa-concluida.png",
    "concluídos",
    "completedTaskCounter",
  ) as HTMLElement;

  const filteredTaskBtn = createStatisticsCounter(
    "filterTasksSection",
    "filterTasksCounterBtn",
    "./src/assets/filtrar-tarefas.png",
    "filtrados",
    "filterTasksCounter",
  ) as HTMLElement;

  //
  const sectionTasksCounter = createSection(`${id}`) as HTMLElement;
  sectionTasksCounter.classList.add("tasks-counters");
  sectionTasksCounter.append(
    allTasksBtn,
    pendingTaskBtn,
    completedTaskBtn,
    filteredTaskBtn,
  );
  return sectionTasksCounter;
}

/* */
function showSearchTaskContainer(): HTMLElement {
  const searchTaskContainer = createSearchContainer(
    "searchTaskContainer",
    { id: "searchTask", placeholder: "Procurar tarefa..." },
    [
      { id: "addTasksBtn", text: "Criar tarefa" },
      { id: "sortTasksBtn", text: "Ordenar A-Z" },
      { id: "removeAllCompletedTaskBtn", text: "Remover tarefas concluídas" },
    ],
  );
  searchTaskContainer.classList.add("search-add-container");
  return searchTaskContainer;
}
