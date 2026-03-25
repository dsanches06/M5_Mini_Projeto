import {
  loadInitialUsers,
  loadAInitialTasks,
  loadInitialProjects,
  loadInitialStatistics,
} from "./src/ui/gestUserTask/index.js";
import { activateMenu } from "./src/ui/dom/index.js";
import { setupCompleteStatisticsPage } from "./src/ui/statistics/StatisticsPageUI.js";
import { ProjectService } from "./src/services/index.js";

//inicializar a aplicação
window.onload = async () => {
  activateMenu("#menuProjects");
  loadInitialProjects();
};

//obter o menu task
const allMenuUsers = document.querySelectorAll(
  "#menuUsers",
) as NodeListOf<HTMLAnchorElement>;
allMenuUsers.forEach((button) => {
  button.addEventListener("click", async () => {
    activateMenu("#menuUsers");
    await loadInitialUsers();
  });
});

//obter o menu task
const allMenuTasks = document.querySelectorAll(
  "#menuTasks",
) as NodeListOf<HTMLAnchorElement>;
allMenuTasks.forEach((button) => {
  button.addEventListener("click", () => {
    activateMenu("#menuTasks");
    loadAInitialTasks();
  });
});

// menuProjects
const allMenuProjects = document.querySelectorAll(
  "#menuProjects",
) as NodeListOf<HTMLAnchorElement>;
allMenuProjects.forEach((button) => {
  button.addEventListener("click", () => {
    activateMenu("#menuProjects");
    loadInitialProjects();
  });
});

// menuStatistics
const allMenuStatistics = document.querySelectorAll(
  "#menuStatistics",
) as NodeListOf<HTMLAnchorElement>;
allMenuStatistics.forEach((button) => {
  button.addEventListener("click", () => {
    activateMenu("#menuStatistics");
    loadInitialStatistics();
  });
});
