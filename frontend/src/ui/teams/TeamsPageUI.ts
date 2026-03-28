import { TeamService } from "../../services/index.js";
import { renderTeamModal } from "../modal/index.js";
import { showTeamsCounters } from "./TeamsCountersUI.js";
import {
  addElementInContainer,
  createHeadingTitle,
  createSearchContainer,
  createStatisticsCounter,
  createSection,
  clearContainer,
} from "../dom/index.js";
import {
  renderTeamsCards,
} from "./index.js";

/* Lista de equipes */
export async function loadTeamsPage(teams: any[]): Promise<void> {
  clearContainer("#containerSection");

  addElementInContainer(
    "#containerSection",
    createHeadingTitle("h2", "GESTÃO DE EQUIPES"),
  );

  const teamCounterSection = createTeamCounter("teamCounters");
  addElementInContainer("#containerSection", teamCounterSection);

  await showTeamsCounters("equipes");

  const searchContainer = showSearchTeamContainer();
  addElementInContainer("#containerSection", searchContainer);

  // renderizar equipes em cards
  renderTeamsCards(teams);

  // Adicionar event listeners aos botões de contador para filtrar
  const allTeamsBtn = teamCounterSection.querySelector(
    "#allTeamsBtn",
  ) as HTMLElement | null;

  if (allTeamsBtn) {
    allTeamsBtn.title = "Mostrar todas as equipes";
    allTeamsBtn.addEventListener("click", async () => {
      const currentTeams = await TeamService.getTeams();
      renderTeamsCards(currentTeams);
      await showTeamsCounters("equipes");
    });
  }

  // Event listener para busca
  const searchTeamInput = document.querySelector(
    "#searchTeam",
  ) as HTMLInputElement;
  if (searchTeamInput) {
    searchTeamInput.addEventListener("input", async () => {
      const searchTerm = searchTeamInput.value;
      const searchedTeams = await TeamService.getTeams();
      const filteredTeams = searchedTeams.filter((t) =>
        (t.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
      renderTeamsCards(filteredTeams);
    });
  }

  // Event listener para adicionar equipe
  const addTeamBtn = document.querySelector("#addTeamBtn") as HTMLElement;
  if (addTeamBtn) {
    addTeamBtn.addEventListener("click", async () => {
      await renderTeamModal();
    });
  }

  // Event listener para ordenar equipes
  const sortTeamsBtn = document.querySelector(
    "#sortTeamsBtn",
  ) as HTMLElement;
  if (sortTeamsBtn) {
    let isAscending = true;
    sortTeamsBtn.addEventListener("click", async () => {
      const allTeams = await TeamService.getTeams();
      const sortedTeams = allTeams.sort((a, b) => {
        const aName = a.name || "";
        const bName = b.name || "";
        return isAscending
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
      isAscending = !isAscending;
      renderTeamsCards(sortedTeams);
      sortTeamsBtn.textContent = isAscending ? "Ordenar A-Z" : "Ordenar Z-A";
    });
  }
}

/* Cria o container de busca */
function showSearchTeamContainer(): HTMLElement {
  const searchTeamContainer = createSearchContainer(
    "searchTeamContainer",
    { id: "searchTeam", placeholder: "Procurar equipe..." },
    [
      { id: "addTeamBtn", text: "Nova equipe" },
      { id: "sortTeamsBtn", text: "Ordenar A-Z" },
    ],
  );
  searchTeamContainer.classList.add("search-add-container");
  return searchTeamContainer;
}

/* Cria o container de contadores de equipes */
function createTeamCounter(id: string): HTMLElement {
  const allTeamsBtn = createStatisticsCounter(
    "allTeamsSection",
    "allTeamsBtn",
    "./src/assets/teams.png",
    "equipes",
    "allTeamsCounter",
  ) as HTMLElement;

  const filterTeamsBtn = createStatisticsCounter(
    "filterTeamsSection",
    "filterTeamsBtn",
    "./src/assets/filter.png",
    "filtradas",
    "filterTeamsCounter",
  ) as HTMLElement;

  const sectionTeamsCounter = createSection(`${id}`) as HTMLElement;
  sectionTeamsCounter.classList.add("teams-counters");
  sectionTeamsCounter.append(
    allTeamsBtn,
    filterTeamsBtn,
  );
  return sectionTeamsCounter;
}
