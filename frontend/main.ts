import {
  loadInitialUsers,
  loadAInitialTasks,
} from "./src/ui/gestUserTask/index.js";
import { activateMenu } from "./src/ui/dom/index.js";
import { setupCompleteStatisticsPage } from "./src/ui/statistics/StatisticsPageExample.js";
import { getTasks, getUsers } from "./src/api/index.js";

//inicializar a aplicação
window.onload = async () => {
  loadInitialUsers();
  activateMenu("#menuUsers");

 await getUsers(); 
 await getTasks();
};

//obter o menu task
const allMenuUsers = document.querySelectorAll('#menuUsers') as NodeListOf<HTMLAnchorElement>;
allMenuUsers.forEach(button => {
  button.addEventListener("click", () => {
    activateMenu("#menuUsers");
    loadInitialUsers();
  });
});

//obter o menu task
const allMenuTasks = document.querySelectorAll('#menuTasks') as NodeListOf<HTMLAnchorElement>;
allMenuTasks.forEach(button => {
  button.addEventListener("click", () => {
    activateMenu("#menuTasks");
    loadAInitialTasks();
  });
});

// menuProjects
const allMenuProjects = document.querySelectorAll('#menuProjects') as NodeListOf<HTMLAnchorElement>;
allMenuProjects.forEach(button => {
  button.addEventListener("click", () => {
    activateMenu("#menuProjects");
    // Carregar projetos quando a função estiver disponível
  });
});

// menuStatistics
const allMenuStatistics = document.querySelectorAll('#menuStatistics') as NodeListOf<HTMLAnchorElement>;
allMenuStatistics.forEach(button => {
  button.addEventListener("click", () => {
    activateMenu("#menuStatistics");
    setupCompleteStatisticsPage();
  });
});
