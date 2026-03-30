import { UserService, TaskService } from "../../services/index.js";
import { UserClass } from "../../models/index.js";
import { getAvatarPath, showInfoBanner } from "../../helpers/index.js";
import { renderUsers, showUsersCounters } from "./index.js";
import { toggleUserState } from "../gestUserTask/index.js";
import { showUserDetails } from "../modal/index.js";
import { TaskAssigneeAPIResponse } from "../../api/dto/typesDTO.js";
import { loadUserTasksPage } from "./index.js";
import { createSection } from "../dom/CreatePage.js";

/* Criar cartão de utilizador */
export async function createUserCard(user: UserClass): Promise<HTMLElement> {
  const divUserCard = createSection("sectionUserCard") as HTMLElement;
  divUserCard.className = "usersContainer";

  const card = document.createElement("div") as HTMLElement;
  card.className = "card";
  // Apenas flip ao clicar no card, sem abrir modal
  card.addEventListener("click", (e) => {
    e.stopPropagation();
    card.classList.toggle("flipped");
  });

  // =====================
  // FACE 1
  // =====================
  const face1 = document.createElement("div");
  face1.className = "face face1";

  const content1 = document.createElement("div");
  content1.className = "content";

  const img = document.createElement("img");
  const randomValue = Math.floor(Math.random() * 4) + 1;

  img.src = getAvatarPath(user.getId(), user.getGender(), randomValue);
  img.alt = "User Avatar";

  const h3 = document.createElement("h3");
  h3.textContent = user.getName().split(" ")[0];

  content1.append(img, h3);
  face1.appendChild(content1);

  // =====================
  // FACE 2
  // =====================
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

  const status = document.createElement("span");
  status.className = "status";
  status.textContent = user.isActive() ? "ativo" : "inativo";
  status.style.color = user.isActive() ? "green" : "red";
  status.style.fontWeight = "10";

  const viewTask = document.createElement("div");
  viewTask.className = "view-task";
  viewTask.title = "Ver tarefas";

  const tasks = document.createElement("span");
  tasks.className = "tasks";

  try {
    const allTasks = await TaskService.getTasks();

    const count = allTasks.filter((task) => {
      const assignees = (task as any).getAssignees?.() || [];
      return assignees.some((a: any) => a.user_id === user.getId());
    }).length;

    tasks.textContent = `${count} tarefa${count !== 1 ? "s" : ""}`;
  } catch {
    tasks.textContent = "0 tarefas";
    console.error("Erro ao carregar tarefas para o contador");
  }


  // Ícone de olho para abrir modal de detalhes
  const eyeOpenIcon = document.createElement("i") as HTMLElement;
  eyeOpenIcon.className = "fas fa-eye fa-lg";
  eyeOpenIcon.style.cursor = "pointer";
  eyeOpenIcon.title = "Ver detalhes do utilizador";
  eyeOpenIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    showUserDetails(user);
  });

  // Ícone de tarefas para abrir página de tarefas do usuário
  const taskIcon = document.createElement("i") as HTMLElement;
  taskIcon.className = "fas fa-tasks fa-lg";
  taskIcon.style.cursor = "pointer";
  taskIcon.title = "Ver tarefas do utilizador";
  taskIcon.addEventListener("click", async (event) => {
    event.stopPropagation();
    try {
      await loadUserTasksPage(user.getId());
    } catch (error) {
      console.error("Erro ao carregar tarefas do utilizador:", error);
      showInfoBanner(
        "Erro ao carregar tarefas do utilizador. Por favor, tente novamente.",
        "error-banner",
      );
    }
  });

  // Container para todos os botões alinhados à direita e em coluna
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  // Não precisa de estilos inline, será ajustado no CSS

  // Sub-container para ícones de ação (olho e tarefas)
  const actionIcons = document.createElement("div");
  actionIcons.style.display = "flex";
  actionIcons.style.gap = "8px";
  actionIcons.appendChild(eyeOpenIcon);
  actionIcons.appendChild(taskIcon);

  // Botões de ativar/desativar e remover
  const cardBtn = userCardBtn(user);
  cardBtn.className = "btnGroup";

  // Adiciona os ícones e botões ao container principal
  buttonContainer.appendChild(actionIcons);
  buttonContainer.appendChild(cardBtn);

  // Container principal flexível: conteúdo à esquerda, botões à direita
  const mainRow = document.createElement("div");
  mainRow.style.display = "flex";
  mainRow.style.flexDirection = "row";
  mainRow.style.justifyContent = "space-between";
  mainRow.style.alignItems = "flex-start";

  // Conteúdo principal (esquerda)
  const contentCol = document.createElement("div");
  contentCol.className = "content";
  contentCol.append(number, name, email, status, tasks);

  // Botões (direita)
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexDirection = "column";
  buttonContainer.style.alignItems = "flex-end";
  buttonContainer.style.justifyContent = "flex-start";
  buttonContainer.style.gap = "8px";
  buttonContainer.style.height = "100%";

  // Ajuste para garantir que actionIcons e cardBtn fiquem em coluna
  if (buttonContainer.childNodes.length === 2) {
    buttonContainer.childNodes[0].style.marginBottom = "8px";
    buttonContainer.childNodes[1].style.marginTop = "0";
  }

  // Monta a linha principal: conteúdo à esquerda, botões à direita
  mainRow.appendChild(contentCol);
  mainRow.appendChild(buttonContainer);

  face2.append(mainRow);

  // montar card
  card.append(face1, face2);

  //montar a section user card
  divUserCard.appendChild(card);

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
    await renderUsers(users as UserClass[]);
    await showUsersCounters("utilizadores");
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
    if (1 > 0) {
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
        await renderUsers(users as UserClass[]);
        await showUsersCounters("utilizadores");
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
