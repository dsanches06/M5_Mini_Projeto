import { addElementInContainer } from "../dom/index.js";
import { TaskService, UserService } from "../../services/index.js";
import { IUser } from "../../models/index.js";

/* Renderiza os sprints em cards na Grid principal */
export async function renderSprintsCards(sprints: any[]): Promise<void> {
  let gridContainer = document.querySelector(
    "#sprintsGridContainer",
  ) as HTMLElement;

  if (!gridContainer) {
    gridContainer = document.createElement("div");
    gridContainer.id = "sprintsGridContainer";
    gridContainer.className = "sprints-grid-container";
    addElementInContainer("#containerSection", gridContainer);
  }

  gridContainer.innerHTML = "";

  for (const sprint of sprints) {
    const card = await createSprintCard(sprint);
    card.style.cursor = "pointer";

    gridContainer.appendChild(card);
  }
}

/* Cria a estrutura individual de cada card de sprint */
async function createSprintCard(sprint: any): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "sprint-card";

  // HEADER (Título)
  const header = document.createElement("div");
  header.className = "card-header";
  const title = document.createElement("h3");
  title.textContent = sprint.name || "Sprint sem nome";
  header.appendChild(title);

  // STATUS (Badge)
  const status = document.createElement("span");
  const statusText = sprint.getStatus?.() || sprint.status || "Ativo";
  status.className = `sprint-status status-${statusText.toLowerCase().replace(" ", "-")}`;
  status.textContent = statusText;

  // DESCRIPTION
  const desc = document.createElement("p");
  desc.className = "sprint-desc";
  desc.textContent = sprint.description || "Sem descrição disponível";

  // INFO (Container Flex)
  const infoContainer = document.createElement("div");
  infoContainer.className = "sprint-info";

  const startDate = document.createElement("span");
  startDate.className = "start-date";
  const startDateValue = sprint.startDate || sprint.start_date || new Date();
  startDate.textContent = `Início: ${new Date(startDateValue).toLocaleDateString("pt-BR")}`;

  const endDate = document.createElement("span");
  endDate.className = "end-date";
  const endDateValue = sprint.endDate || sprint.end_date || new Date();
  endDate.textContent = `Fim: ${new Date(endDateValue).toLocaleDateString("pt-BR")}`;

  infoContainer.appendChild(startDate);
  infoContainer.appendChild(endDate);

  const footer = document.createElement("div");
  footer.className = "sprint-card-footer";

  const avatarStack = document.createElement("div");
  avatarStack.className = "avatar-stack";

  try {
    // Carregar tasks do sprint
    const allTasks = await TaskService.getTasks();
    const sprintTasks = allTasks.filter((task: any) => task.sprint_id === sprint.id);

    // Extrair todos os user_ids únicos dos assignees
    const userIdsSet = new Set<number>();
    sprintTasks.forEach((task: any) => {
      const assignees = task.getAssignees?.() || [];
      assignees.forEach((assignee: any) => {
        if (assignee.user_id) {
          userIdsSet.add(assignee.user_id);
        }
      });
    });

    // Carregar todos os users para pegar gender
    const allUsers = await UserService.getUsers();
    const userMap = new Map<number, IUser>();
    allUsers.forEach((user: IUser) => {
      userMap.set(user.getId(), user);
    });

    // Construir array de membros com gender
    const members: Array<{ userId: number; gender: string; user: IUser }> = [];
    userIdsSet.forEach((userId) => {
      const user = userMap.get(userId);
      if (user) {
        members.push({
          userId,
          gender: (user as any).getGender?.() || "Male",
          user,
        });
      }
    });

    // Renderizar avatares (máximo 4)
    const displayLimit = 4;
    members.slice(0, displayLimit).forEach((member, index) => {
      const img = document.createElement("img");
      img.className = "avatar-img";

      // Selecionar pasta baseado no gender
      const folder = member.gender === "Female" ? "woman" : "man";
      const randomValue = (index % 4) + 1; // 1-4
      img.src = `./src/assets/${folder}-${randomValue}.png`;
      img.alt = member.user.getName();
      img.title = member.user.getName();

      avatarStack.appendChild(img);
    });

    // Mostrar "+X" se houver mais membros
    if (members.length > displayLimit) {
      const more = document.createElement("span");
      more.className = "avatar-more";
      more.textContent = `+${members.length - displayLimit}`;
      avatarStack.appendChild(more);
    }
  } catch (error) {
    console.error("Erro ao carregar membros do sprint:", error);
  }

  footer.appendChild(avatarStack);

  // Adicionar ao card na ordem correta
  card.appendChild(header);
  card.appendChild(status);
  card.appendChild(desc);
  card.appendChild(infoContainer);
  card.appendChild(footer);

  return card;
}
