import {
  loadInitialUsers,
  loadAInitialTasks,
  loadInitialProjects,
  loadInitialStatistics,
  loadInitialTeams,
  loadInitialSprints,
  loadInitialTags,
} from "./src/ui/gestUserTask/index.js";
import { activateMenu } from "./src/ui/dom/index.js";

//inicializar a aplicação
window.onload = async () => {
  activateMenu("#menuProjects");
  await loadInitialProjects();
  // Configurar submenu de Projetos
  setupProjectsSubmenu();
};

// Configurar o submenu de Projetos
async function setupProjectsSubmenu(): Promise<void> {
  const projectsBtn = document.querySelector("#menuProjects") as HTMLElement;
  const submenu = document.querySelector("#projectsSubmenu") as HTMLElement;

  if (projectsBtn && submenu) {
    projectsBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      activateMenu("#menuProjects");
      await loadInitialProjects();
      submenu.classList.toggle("show");
      projectsBtn.classList.toggle("expanded");
    });
  }
}

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
  button.addEventListener("click", async () => {
    activateMenu("#menuTasks");
    await loadAInitialTasks();
  });
});

// menuTeams
const allMenuTeams = document.querySelectorAll(
  "#menuTeams",
) as NodeListOf<HTMLAnchorElement>;
allMenuTeams.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    activateMenu("#menuTeams");
    await loadInitialTeams();
  });
});

// menuSprints
const allMenuSprints = document.querySelectorAll(
  "#menuSprints",
) as NodeListOf<HTMLAnchorElement>;
allMenuSprints.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    activateMenu("#menuSprints");
    await loadInitialSprints();
  });
});

// menuTags
const allMenuTags = document.querySelectorAll(
  "#menuTags",
) as NodeListOf<HTMLAnchorElement>;
allMenuTags.forEach((button) => {
  button.addEventListener("click", async () => {
    activateMenu("#menuTags");
    await loadInitialTags();
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
