import { UserService } from "../../services/index.js";
import { UserClass } from "../../models/index.js";
import { showInfoBanner } from "../../helpers/index.js";
import { renderUsers, showUsersCounters } from "./index.js";
import { createSection } from "../dom/index.js";
import { removeUserByID, toggleUserState } from "../gestUserTask/index.js";
import { loadTasksPage } from "../tasks/index.js";
import { showUserDetails } from "../modal/index.js";

/* Criar cartão de utilizador */
export function createUserCard(user: UserClass): HTMLElement {
  const divUserCard = createSection("sectionUserCard") as HTMLElement;
  divUserCard.className = "cardContainer";

  const card = document.createElement("div") as HTMLElement;
  card.className = "card";
  card.addEventListener("click", () => showUserDetails(user));
  divUserCard.appendChild(card);

  const face1 = document.createElement("div") as HTMLElement;
  face1.className = "face face1";

  const content1 = document.createElement("div") as HTMLElement;
  content1.className = "content";

  const randomValue = Math.floor(Math.random() * 4) + 1;
  const imageFolder = user.getGender() === "Masculino" ? "man" : "woman";
  const img = document.createElement("img") as HTMLImageElement;
  img.src = `./src/assets/${imageFolder}-${randomValue}.png`;
  img.alt = "User Avatar";

  const h3 = document.createElement("h3") as HTMLElement;
  h3.textContent = user.getName().split(" ")[0];

  content1.append(img, h3);
  face1.appendChild(content1);
  card.appendChild(face1);

  const face2 = document.createElement("div");
  face2.className = "face face2";

  const content2 = document.createElement("div");
  content2.className = "content";

  const number = document.createElement("span");
  number.className = "number";
  number.textContent = user.getId().toString();

  const name = document.createElement("span");
  name.className = "name";
  name.textContent = user.getName();

  const email = document.createElement("span");
  email.className = "email";
  email.textContent = user.getEmail();

  const status = document.createElement("span") as HTMLElement;
  status.textContent = `${user.isActive() ? "ativo" : "Inativo"}`;

  //Mostra o estado com texto ou cor diferente
  status.style.color = user.isActive() ? "green" : "red";
  status.style.fontWeight = "bold";

  const viewTask = document.createElement("div");
  viewTask.className = "view-task";
  viewTask.title = "Ver tarefas";

  const tasks = document.createElement("span");
  tasks.className = "tasks";
  tasks.textContent = `${user.getTasks().length} tarefas`;

  const eyeOpenIcon = document.createElement("i") as HTMLElement;
  eyeOpenIcon.className = "fa-solid fa-eye fa-lg";

  const eyeCloseIcon = document.createElement("i") as HTMLElement;
  eyeCloseIcon.className = "fa-solid fa-eye-slash fa-lg";

  const eyeIcon = user.getTasks().length > 0 ? eyeOpenIcon : eyeCloseIcon;
  eyeIcon.style.cursor = "pointer";
  eyeIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    loadTasksPage(user);
  });

  viewTask.append(tasks, eyeIcon);

  const cardBtn = userCardBtn(user);
  cardBtn.className = "btnGroup";

  content2.appendChild(number);
  content2.appendChild(name);
  content2.appendChild(email);
  content2.appendChild(status);
  content2.appendChild(viewTask);
  content2.appendChild(cardBtn);

  face2.appendChild(content2);
  card.appendChild(face2);

  return divUserCard;
}

/* Função para criar os botões do cartão de usuário */
function userCardBtn(user: UserClass): HTMLElement {
  const toogleIcon = document.createElement("i") as HTMLElement;
  toogleIcon.className = user.isActive()
    ? "fa-solid fa-toggle-on fa-2xl"
    : "fa-solid fa-toggle-off fa-2xl";

  const bntToggle = document.createElement("span") as HTMLElement;
  bntToggle.appendChild(toogleIcon);
  bntToggle.id = "toogleBtn";
  bntToggle.title = "Ativar ou desativar utilizador";
  bntToggle.addEventListener("click", async (event) => {
    event.stopPropagation();
    await toggleUserState(user.getId());
    // TODO: Recarregar lista de utilizadores da API
    const users = await UserService.getUsers();
    renderUsers(users as UserClass[]);
    showUsersCounters(users as UserClass[], "utilizadores");
  });

  const trashIcon = document.createElement("i") as HTMLElement;
  trashIcon.className = "fa-solid fa-trash fa-lg";

  const btnRemover = document.createElement("span") as HTMLButtonElement;
  btnRemover.appendChild(trashIcon);
  btnRemover.id = "removeBtn";
  btnRemover.role = "button";
  btnRemover.style.color = "#ff4c4c";
  btnRemover.title = "Remover tarefas do utilizador";
  btnRemover.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (user.getTasks().length > 0) {
      showInfoBanner(
        "Utilizador com tarefas pendentes não pode ser removido.",
        "error-banner",
      );
    } else {
      try {
        // TODO: Implementar deleção de utilizador via API
        // const removed = await UserService.deleteUser(user.getId());
        showInfoBanner("Utilizador removido com sucesso.", "info-banner");
        //atualiza a lista de utilizadores
        const users = await UserService.getUsers();
        renderUsers(users as UserClass[]);
        showUsersCounters(
          users as UserClass[],
          "utilizadores",
        );
      } catch (error) {
        showInfoBanner("Erro ao remover utilizador.", "error-banner");
      }
    }
  });

  //para agrupar os botoes
  const divUserCardBtn = document.createElement("section") as HTMLElement;
  divUserCardBtn.appendChild(bntToggle);
  divUserCardBtn.appendChild(btnRemover);

  return divUserCardBtn;
}
