import { UserService, TaskService } from "../../services/index.js";
import { UserClass } from "../../models/index.js";
import { getAvatarPath, showInfoBanner } from "../../helpers/index.js";
import { renderUsers, showUsersCounters } from "./index.js";
import { toggleUserState } from "../gestUserTask/index.js";
import { showUserDetails } from "../modal/index.js";
import { TaskAssigneeAPIResponse } from "../../api/dto/typesDTO.js";
import { loadUserTasksPage } from "./index.js";

/* Criar cartão de utilizador */
export async function createUserCard(user: UserClass): Promise<HTMLElement> {
  const divUserCard = document.createElement("section") as HTMLElement;
  divUserCard.className = "cardContainer sectionUserCard";

  const card = document.createElement("div") as HTMLElement;
  card.className = "card";
  card.addEventListener("click", () => showUserDetails(user));
  divUserCard.appendChild(card);

  const face1 = document.createElement("div") as HTMLElement;
  face1.className = "face face1";

  const content1 = document.createElement("div") as HTMLElement;
  content1.className = "content";

  const randomValue = Math.floor(Math.random() * 4) + 1;
  const img = document.createElement("img") as HTMLImageElement;
  img.src = getAvatarPath(user.getId(), user.getGender(), randomValue);
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
  status.textContent = `${user.isActive() ? "activo" : "Inactivo"}`;

  //Mostra o estado com texto ou cor diferente
  status.style.color = user.isActive() ? "green" : "red";
  status.style.fontWeight = "bold";

  const viewTask = document.createElement("div");
  viewTask.className = "view-task";
  viewTask.title = "Ver tarefas";

  const tasks = document.createElement("span");
  tasks.className = "tasks";
  
  // Contar tarefas atribuídas a este utilizador
  try {
    const allTasks = await TaskService.getTasks();
    const userTaskCount = allTasks.filter((task) => {
      const assignees = (task as any).getAssignees?.() || [] as TaskAssigneeAPIResponse[];
      return assignees.some((a: TaskAssigneeAPIResponse) => a.user_id === user.getId());
    }).length;
    
    tasks.textContent = `${userTaskCount} tarefa${userTaskCount !== 1 ? 's' : ''}`;
  } catch (error) {
    console.error("Erro ao carregar tarefas para o contador:", error);
    tasks.textContent = "0 tarefas";
  }

  const eyeOpenIcon = document.createElement("i") as HTMLElement;
  eyeOpenIcon.className = "fa-solid fa-eye fa-lg";

  const eyeCloseIcon = document.createElement("i") as HTMLElement;
  eyeCloseIcon.className = "fa-solid fa-eye-slash fa-lg";

  const eyeIcon = 1 > 0 ? eyeOpenIcon : eyeCloseIcon;
  eyeIcon.style.cursor = "pointer";
  eyeIcon.addEventListener("click", async (event) => {
    event.stopPropagation();
    
    // Carregar todas as tarefas e filtrar apenas as atribuídas ao utilizador
    try {
      const allTasks = await TaskService.getTasks();
      
      // Filtrar tarefas que têm assignees para este utilizador
      const userAssignedTasks = allTasks.filter((task) => {
        const assignees = (task as any).getAssignees?.() || [] as TaskAssigneeAPIResponse[];
        return assignees.some((a: TaskAssigneeAPIResponse) => a.user_id === user.getId());
      });
      
      // Carregar página de tarefas com apenas as tarefas atribuídas ao utilizador
      await loadUserTasksPage(user.getId());

    } catch (error) {
      console.error("Erro ao carregar tarefas do utilizador:", error);
      showInfoBanner(
        "Erro ao carregar tarefas do utilizador. Por favor, tente novamente.",
        "error-banner",
      );
    }
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
