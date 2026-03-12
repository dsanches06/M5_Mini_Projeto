import { IUser, UserClass } from "../../models/index.js";
import { createSection } from "../dom/index.js";
import { createUserCard } from "./index.js";
import {generateRandomColor} from "../../helpers/index.js";

/* Container de utilizadores */
const usersContainer = createSection("usersContainer") as HTMLElement;

/* Função de renderização */
export function renderUsers(users: IUser[]): HTMLElement {
  usersContainer.innerHTML = "";
  users.forEach((user) =>
    //Para cada utilizador, cria um cartão HTML.
    usersContainer.appendChild(createUserCard(user as UserClass)),
  );
  // Aplicar cores aos cartões
  applyCardColors(usersContainer);
  return usersContainer;
}

/* Aplicar cores aos cartões */
function applyCardColors(usersContainer: HTMLElement): void {
  const cards = Array.from(usersContainer.querySelectorAll(".card"));
  for (const card of cards) {
    // Gerar uma cor aleatória suave
    const randomColor = generateRandomColor();
    const title = card.querySelector(".face1") as HTMLElement;
    if (title) {
      title.style.background = randomColor;
    }
    const contentA = card.querySelector(
      ".btnGroup span#toogleBtn",
    ) as HTMLElement;
    if (contentA) {
      contentA.style.color = randomColor;
    }
  }
}


