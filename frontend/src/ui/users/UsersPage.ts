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
export function loadUsersPage(users: IUser[]): void {
  clearContainer("#containerSection");

  addElementInContainer(
    "#containerSection",
    createHeadingTitle("h2", "GESTÃO DE UTILIZADORES"),
  );

  const userCounterSection = createUserCounter("userCounters");
  addElementInContainer("#containerSection", userCounterSection);

  showUsersCounters(users, "utilizadores");

  const searchContainer = showSearchContainer();
  addElementInContainer("#containerSection", searchContainer);

  const usersContainer = renderUsers(UserService.getAllUsers());
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

  allUsersBtn.addEventListener("click", () => {
    const currentUsers = UserService.getAllUsers();
    renderUsers(currentUsers as UserClass[]);
    showUsersCounters(currentUsers as UserClass[], "utilizadores");
  });

  ativeUsersBtn.addEventListener("click", () => {
    const currentUsers = UserService.getAllUsers();
    const activeUsers = getActiveUsers(currentUsers);
    renderUsers(activeUsers as UserClass[]);
    showUsersCounters(activeUsers as UserClass[], "activos");
  });

  unableUsersBtn.addEventListener("click", () => {
    const currentUsers = UserService.getAllUsers();
    const inactiveUsers = getInactiveUsers(currentUsers);
    renderUsers(inactiveUsers as UserClass[]);
    showUsersCounters(inactiveUsers as UserClass[], "inactivos");
  });

  // Adicionar event listeners aos botões de busca
  const addUserBtn = document.querySelector("#addUserBtn") as HTMLElement;
  addUserBtn.addEventListener("click", () => {
    renderUserModal();
  });

  const sortUsersBtn = document.querySelector("#sortUsersBtn") as HTMLElement;

  if (sortUsersBtn) {
    //Crie uma variável de controle de estado
    let isAscending = true;
    sortUsersBtn.addEventListener("click", () => {
      const sortedUsers = sortUsersByName(isAscending);
      //Inverta o estado para o próximo clique
      isAscending = !isAscending;
      // Mostrar os utilizadores ordenados
      loadUsersPage(sortedUsers);
      renderUsers(sortedUsers as UserClass[]);
      showUsersCounters(sortedUsers as UserClass[], "userFiltered");
      // Atualize o texto ou ícone do botão
      sortUsersBtn.textContent = isAscending ? "Ordenar A-Z" : "Ordenar Z-A";
    });
  } else {
    console.warn("Elemento #sortUsersBtn não foi renderizado no DOM.");
  }

  //
  const searchUser = document.querySelector("#searchUser") as HTMLInputElement;
  if (searchUser) {
    searchUser.addEventListener("input", () => {
      const name = searchUser.value.toLowerCase();
      const filteredUsers = searchUserByName(name);
      renderUsers(filteredUsers);
      showUsersCounters(filteredUsers as UserClass[], "userFiltered");
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
