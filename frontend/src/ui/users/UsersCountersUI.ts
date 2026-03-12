import { IUser } from "../../models/index.js";

export function showUsersCounters(filteredUser: IUser[], type?: string): void {
  countAllUsers("#allUsersCounter", filteredUser);
  countAtiveUsers("#ativeUsersCounter", filteredUser);
  countUnableUsers("#unableUsersCounter", filteredUser);
  countFilterUsers("#filterUsersCounter", type!, filteredUser);
  countAtiveInativePercentage(
    "#ativeUsersPercentageCounter",
    type!,
    filteredUser,
  );
}

/* Contador de utilizadores ativos */
function countAtiveUsers(id: string, filteredUser: IUser[]): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    section.textContent = `${filteredUser.filter((user) => user.isActive()).length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de utilizadores inativos */
function countUnableUsers(id: string, filteredUser: IUser[]): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    section.textContent = `${filteredUser.filter((user) => !user.isActive()).length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de utilizadores filtrados por nome */
function countFilterUsers(
  id: string,
  type: string,
  filteredUser: IUser[],
): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    if (type === "userFiltered" && section.textContent !== "") {
      section.textContent = `${filteredUser.length}`;
    } else {
      section.textContent = "0";
    }
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de utilizadores */
function countAllUsers(id: string, filteredUser: IUser[]): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    section.textContent = `${filteredUser.length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Percentagem de utilizadores ativos */
function countAtiveInativePercentage(
  id: string,
  type: string,
  filteredUser: IUser[],
): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  let activeInativeUsers;

  if (section) {
    if (type === "inactivos") {
      activeInativeUsers = filteredUser.filter(
        (user) => !user.isActive(),
      ).length;
    } else {
      activeInativeUsers = filteredUser.filter((user) =>
        user.isActive(),
      ).length;
    }

    const totalUsers = filteredUser.length;
    const percentage =
      totalUsers > 0 ? ((activeInativeUsers / totalUsers) * 100).toFixed(2) : 0;
    section.textContent = `${percentage}%`;
    changeImageAndFigCaption(type!);
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

function changeImageAndFigCaption(type: string) {
  if (type) {
    const ativosPercentangeCaption = document.querySelector(
      "#ativosPercentangeCaption",
    ) as HTMLElement;

    const ativeUsersPercentageBtn = document.querySelector(
      "#ativeUsersPercentageBtn",
    ) as HTMLImageElement;

    if (ativosPercentangeCaption && ativeUsersPercentageBtn) {
      switch (type) {
        case "inactivos":
          ativeUsersPercentageBtn.title =
            "Mostrar percentagem de utilizadores inactivos";
          ativeUsersPercentageBtn.src = "./src/assets/grafico.png";
          ativosPercentangeCaption.textContent = "inactivos %";
          break;
        case "utilizadores":
        case "activos":
          ativeUsersPercentageBtn.title =
            "Mostrar percentagem de utilizadores activos";
          ativeUsersPercentageBtn.src = "./src/assets/percentagem.png";
          ativosPercentangeCaption.textContent = "activos %";
          break;
        default:
      }
    } else {
      console.warn(`Elemento ativosCaption não foi encontrado no DOM.`);
    }
  }
}
