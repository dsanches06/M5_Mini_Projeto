import { IUser } from "../../models/index.js";
import { ITask } from "../../tasks/index.js";
import { TaskService } from "../../services/index.js";
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
  createHeadingTitle,
  createStatisticsCounter,
  createSearchContainer,
  clearContainer,
} from "../dom/index.js";
import { createNotificationsUI } from "../notifications/notificationsUI.js";
import { renderDashboard } from "../dashboard/RenderDashBoardUI.js";

/* Lista de tarefas obtidas da API */
export async function loadTasksPage(user?: IUser, filteredTasks?: ITask[]): Promise<void> {
  clearContainer("#containerSection");

  if (user) {
    addElementInContainer(
      "#containerSection",
      await createNotificationsUI(user),
    );
  }

  const title = user ? `Tarefas de ${user.getName()}` : "GESTÃO DE TAREFAS";
  addElementInContainer("#containerSection", createHeadingTitle("h2", title));

  const taskCounterSection = createTaskCounter("taskCounters") as HTMLElement;
  addElementInContainer("#containerSection", taskCounterSection);

  // Carregar tarefas da API ou usar tarefas filtradas fornecidas
  let tasks: ITask[];
  if (filteredTasks !== undefined && filteredTasks.length > 0) {
    tasks = filteredTasks;
    console.log(`📋 Usando ${filteredTasks.length} tarefas filtradas`);
  } else if (filteredTasks !== undefined && filteredTasks.length === 0) {
    tasks = filteredTasks; // Array vazio - utilizador sem tarefas atribuídas
    console.log(`📋 Utilizador sem tarefas atribuídas`);
  } else {
    tasks = await TaskService.getTasks();
    console.log(`📋 Carregadas ${tasks.length} tarefas da API`);
  }
  
  console.log(`🎯 Total de tarefas a renderizar:`, tasks.length);
  
  // Mostrar contadores com as tarefas atuais (filtradas ou todas)
  await showTasksCounters("tarefas", tasks);

  const searchContainer = showSearchTaskContainer();
  addElementInContainer("#containerSection", searchContainer);

  // Renderizar dashboard com as tarefas
  await renderDashboard(tasks, user);

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

  allTasksBtn.addEventListener("click", async () => {
    const currentTasks = tasks;
    clearContainer("#containerSection > :nth-child(n+4)");
    await renderDashboard(currentTasks, user);
    await showTasksCounters("tarefas", currentTasks);
  });

  pendingTaskBtn.addEventListener("click", async () => {
    const tasksPending = tasks.filter((task) => !task.getCompleted());
    clearContainer("#containerSection > :nth-child(n+4)");
    await renderDashboard(tasksPending, user);
    await showTasksCounters("pendentes", tasksPending);
  });

  completedTaskBtn.addEventListener("click", async () => {
    const tasksCompleted = tasks.filter((task) => task.getCompleted());
    clearContainer("#containerSection > :nth-child(n+4)");
    await renderDashboard(tasksCompleted, user);
    await showTasksCounters("concluídas", tasksCompleted);
  });

  const addTasksBtn = document.querySelector("#addTasksBtn") as HTMLElement;
  if (addTasksBtn) {
    addTasksBtn.addEventListener("click", () => {
      renderTaskModal(user);
    });
  } else {
    console.warn("Elemento #addTasksBtn não foi renderizado no DOM.");
  }

  const sortTasksBtn = document.querySelector("#sortTasksBtn") as HTMLElement;
  if (sortTasksBtn) {
    let isAscending = true;
    sortTasksBtn.addEventListener("click", async () => {
      const sortedTasks = await sortTasksByTitle(isAscending);
      isAscending = !isAscending;
      clearContainer("#containerSection > :nth-child(n+4)");
      await renderDashboard(sortedTasks, user);
      await showTasksCounters("filtradas", sortedTasks);
      sortTasksBtn.textContent = isAscending ? "Ordenar A-Z" : "Ordenar Z-A";
    });
  } else {
    console.warn("Elemento #sortTasksBtn não foi renderizado no DOM.");
  }

  // Adicionar event listeners ao input de busca
  const searchTaskInput = document.querySelector(
    "#searchTask",
  ) as HTMLInputElement;
  if (searchTaskInput) {
    searchTaskInput.addEventListener("input", async () => {
      const searchTerm = searchTaskInput.value.toLowerCase();
      if (searchTerm.trim() === "") {
        clearContainer("#containerSection > :nth-child(n+4)");
        await renderDashboard(tasks, user);
        await showTasksCounters("tarefas", tasks);
      } else {
        // Buscar dentro das tarefas atuais (filtradas ou não)
        const filteredSearchTasks = tasks.filter((task) =>
          task.getTitle().toLowerCase().includes(searchTerm)
        );
        clearContainer("#containerSection > :nth-child(n+4)");
        await renderDashboard(filteredSearchTasks, user);
        await showTasksCounters("filtradas", filteredSearchTasks);
      }
    });
  } else {
    console.warn("Elemento de busca de tarefas não encontrado.");
  }

  // Adicionar event listener ao botão de remover tarefas concluídas
  const removeAllCompletedTaskBtn = document.querySelector(
    "#removeAllCompletedTaskBtn",
  ) as HTMLElement;

  if (removeAllCompletedTaskBtn) {
    removeAllCompletedTaskBtn.addEventListener("click", async () => {
      const remainingTasks = await removeAllCompletedTask();
      clearContainer("#containerSection > :nth-child(n+4)");
      await renderDashboard(remainingTasks, user);
      await showTasksCounters("tarefas", remainingTasks);
    });
  } else {
    console.warn(
      "Elemento #removeAllCompletedTaskBtn não foi renderizado no DOM.",
    );
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
