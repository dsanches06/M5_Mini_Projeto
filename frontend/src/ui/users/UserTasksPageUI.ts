import { IUser } from "../../models/index.js";
import { ITask } from "../../tasks/index.js";
import { TaskAssigneeService, TaskService, UserService } from "../../services/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { showTasksCounters } from "../tasks/index.js";
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

/* Lista de tarefas de utilizador obtidas da API */
export async function loadUserTasksPage(
  userId: number,
): Promise<void> {
  clearContainer("#containerSection");

  try {
    const user = await UserService.getUserById(userId);
    
    if (!user) {
      showInfoBanner("Utilizador não encontrado", "error-banner");
      return;
    }

    // Obter atribuições de tarefas do utilizador
    const assigneesTasks = await TaskAssigneeService.getTaskAssigneesByUserId(userId);
    
    // Obter detalhes das tarefas atribuídas
    const tasks: ITask[] = [];
    for (const assignee of assigneesTasks) {
      const task: ITask = await TaskService.getTaskById(assignee.task_id);
      tasks.push(task);
    }

    if (user) {
      addElementInContainer(
        "#containerSection",
        await createNotificationsUI(user),
      );
    }

    const title =  `Tarefas de ${user.getName()}`;
    addElementInContainer("#containerSection", createHeadingTitle("h2", title));

    const taskCounterSection = createTaskCounter("taskCounters") as HTMLElement;
    addElementInContainer("#containerSection", taskCounterSection);

    // Mostrar contadores com as tarefas do utilizador
    await showTasksCounters("tarefas", tasks);

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

      await showTasksCounters("tarefas", currentTasks);
    });

    pendingTaskBtn.addEventListener("click", async () => {
      const tasksPending = tasks.filter((task) => !task.getCompleted());
      clearContainer("#containerSection > :nth-child(n+4)");

      await showTasksCounters("pendentes", tasksPending);
    });

    completedTaskBtn.addEventListener("click", async () => {
      const tasksCompleted = tasks.filter((task) => task.getCompleted());
      clearContainer("#containerSection > :nth-child(n+4)");

      await showTasksCounters("concluídas", tasksCompleted);
    });

    const addTasksBtn = document.querySelector("#addTasksBtn") as HTMLElement;
    if (addTasksBtn) {
      addTasksBtn.addEventListener("click", () => {
        //renderTaskModal(user);
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

          await showTasksCounters("tarefas", tasks);
        } else {
          // Buscar dentro das tarefas atuais (filtradas ou não)
          const filteredSearchTasks = tasks.filter((task) =>
            task.getTitle().toLowerCase().includes(searchTerm),
          );
          clearContainer("#containerSection > :nth-child(n+4)");

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

        await showTasksCounters("tarefas", remainingTasks);
      });
    } else {
      console.warn(
        "Elemento #removeAllCompletedTaskBtn não foi renderizado no DOM.",
      );
    }
  } catch (error) {
    console.error("Erro ao carregar tarefas do utilizador:", error);
    showInfoBanner(
      "Erro ao carregar tarefas do utilizador. Por favor, tente novamente.",
      "error-banner",
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


  //
  const sectionTasksCounter = createSection(`${id}`) as HTMLElement;
  sectionTasksCounter.classList.add("tasks-counters");
  sectionTasksCounter.append(
    allTasksBtn,
    pendingTaskBtn,
    completedTaskBtn
  );
  return sectionTasksCounter;
}

