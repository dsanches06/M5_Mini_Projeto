import { IUser, UserClass } from "../../models/index.js";
import { UserService } from "../../services/index.js";
import {
  addElementInContainer,
  createSection,
  createHeadingTitle,
  createStatisticsCounter,
  createSearchContainer,
  clearContainer,
} from "../dom/index.js";
import { renderUsers, showUsersCounters } from "./index.js";
import { renderUserModal } from "../modal/index.js";
import {
  sortUsersByName,
  searchUserByName,
  getActiveUsers,
  getInactiveUsers,
} from "../gestUserTask/index.js";

/* Lista de utilizadores */
export async function loadUsersPage(users: IUser[]): Promise<void> {
  clearContainer("#containerSection");

  addElementInContainer(
    "#containerSection",
    createHeadingTitle("h2", "GESTÃO DE UTILIZADORES"),
  );

  const userCounterSection = createUserCounter("userCounters");
  addElementInContainer("#containerSection", userCounterSection);

  await showUsersCounters("utilizadores");

  const searchContainer = showSearchContainer();
  addElementInContainer("#containerSection", searchContainer);

  const usersContainer = await renderUsers(users);
  addElementInContainer("#containerSection", usersContainer);

  // Adicionar event listeners aos botões de contador para filtrar
  const allUsersBtn = userCounterSection.querySelector(
    "#allUsersBtn",
  ) as HTMLElement;
  allUsersBtn.title = "Mostrar todos os utilizadores";
  const ativeUsersBtn = userCounterSection.querySelector(
    "#ativeUsersBtn",
  ) as HTMLElement;
  ativeUsersBtn.title = "Mostrar todosos utilizadores ativos";
  const unableUsersBtn = userCounterSection.querySelector(
    "#unableUsersBtn",
  ) as HTMLElement;
  unableUsersBtn.title = "Mostrar todos os utilizadores inativos";

  const filterUsersBtn = userCounterSection.querySelector(
    "#filterUsersBtn",
  ) as HTMLElement;
  filterUsersBtn.title = "Mostrar todos os utilizadores filtrados pelo nome";

  allUsersBtn.addEventListener("click", async () => {
    const currentUsers = await UserService.getUsers();
    clearContainer("#containerSection > :nth-child(4)");
    await renderUsers(currentUsers as UserClass[]);
    await showUsersCounters("utilizadores");
  });

  ativeUsersBtn.addEventListener("click", async () => {
    const activeUsers = await getActiveUsers();
    clearContainer("#containerSection > :nth-child(4)");
    await renderUsers(activeUsers as UserClass[]);
    await showUsersCounters("ativos", activeUsers as UserClass[]);
  });

  unableUsersBtn.addEventListener("click", async () => {
    const inactiveUsers = await getInactiveUsers();
    clearContainer("#containerSection > :nth-child(4)");
    await renderUsers(inactiveUsers as UserClass[]);
    await showUsersCounters("inativos", inactiveUsers as UserClass[]);
  });

  // Adicionar event listeners aos botões de busca
  const addUserBtn = document.querySelector("#addUserBtn") as HTMLElement;
  addUserBtn.addEventListener("click", () => {
    renderUserModal();
  });

  const sortUsersBtn = document.querySelector("#sortUsersBtn") as HTMLElement;

  if (sortUsersBtn) {
    let isAscending = true;
    sortUsersBtn.addEventListener("click", async () => {
      const sortedUsers = await sortUsersByName(isAscending);
      isAscending = !isAscending;
      clearContainer("#containerSection > :nth-child(4)");
      await renderUsers(sortedUsers as UserClass[]);
      await showUsersCounters("filtrados", sortedUsers as UserClass[]);
      sortUsersBtn.textContent = isAscending ? "Ordenar Z-A" : "Ordenar A-Z";
    });
  } else {
    console.warn("Elemento #sortUsersBtn não foi renderizado no DOM.");
  }

  const searchUser = document.querySelector("#searchUser") as HTMLInputElement;
  if (searchUser) {
    searchUser.addEventListener("input", async () => {
      const name = searchUser.value.toLowerCase();
      if (name.trim() === "") {
        const allUsers = await UserService.getUsers();
        clearContainer("#containerSection > :nth-child(4)");
        await renderUsers(allUsers as UserClass[]);
        await showUsersCounters("utilizadores");
      } else {
        const filteredUsers = await searchUserByName(name);
        clearContainer("#containerSection > :nth-child(4)");
        await renderUsers(filteredUsers as UserClass[]);
        await showUsersCounters("filtrados", filteredUsers as UserClass[]);
      }
    });
  } else {
    console.warn("Elemento de busca de utilizadores não encontrado.");
  }
}
/* */
function createUserCounter(id: string): HTMLElement {
  //
  const allUsersBtn = createStatisticsCounter(
    "allUserSection",
    "allUsersBtn",
    "./src/assets/users.png",
    "utilizadores",
    "allUsersCounter",
  ) as HTMLElement;

  //
  const ativeUsersBtn = createStatisticsCounter(
    "ativeUsers",
    "ativeUsersBtn",
    "./src/assets/active.png",
    "ativos",
    "ativeUsersCounter",
  ) as HTMLElement;
  //
  const unableUsersBtn = createStatisticsCounter(
    "unableUsers",
    "unableUsersBtn",
    "./src/assets/inactive.png",
    "inativos",
    "unableUsersCounter",
  ) as HTMLElement;

  const filterUsersBtn = createStatisticsCounter(
    "filterUsersSection",
    "filterUsersBtn",
    "./src/assets/filter.png",
    "fltrados",
    "filterUsersCounter",
  ) as HTMLElement;

  const ativeUsersPercentageBtn = createStatisticsCounter(
    "ativeUserPercentage",
    "ativeUsersPercentageBtn",
    "./src/assets/percentagem.png",
    "ativos %",
    "ativeUsersPercentageCounter",
  ) as HTMLElement;

  const sectionUsersCounter = createSection(`${id}`) as HTMLElement;
  sectionUsersCounter.classList.add("users-counters");
  sectionUsersCounter.append(
    allUsersBtn,
    ativeUsersBtn,
    unableUsersBtn,
    filterUsersBtn,
    ativeUsersPercentageBtn,
  );
  return sectionUsersCounter;
}

/* */
export function showSearchContainer(): HTMLElement {
  const searchUserContainer = createSearchContainer(
    "searchUserContainer",
    { id: "searchUser", placeholder: "Procurar utilizador..." },
    [
      { id: "addUserBtn", text: "Adicionar utilizador" },
      { id: "sortUsersBtn", text: "Ordenar A-Z" },
    ],
  );
  searchUserContainer.classList.add("search-add-container");
  return searchUserContainer;
}
