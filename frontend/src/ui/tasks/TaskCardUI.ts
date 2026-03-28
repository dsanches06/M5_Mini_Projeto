import { ITask } from "../../tasks/index.js";
import { IUser } from "../../models/index.js";
import { getCardBorderColor, setCardBorderColor, showInfoBanner } from "../../helpers/index.js";
import { loadTaskDetailPage } from "./TaskDetailPageUI.js";
import { TaskService, UserService } from "../../services/index.js";

export async function createTaskCard(
  task: ITask,
  userMap: Map<number, IUser>,
): Promise<HTMLElement> {
  const assigneeName = getAssigneeNameFromMap(task, userMap);
  return await buildTaskCard(task, assigneeName);
}

export async function renderTaskCards(
  container: HTMLElement,
  tasks: ITask[],
): Promise<void> {
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
  container.style.gap = "1rem";

  for (const task of tasks) {
    const taskCard = await createTaskCardElement(task);
    container.appendChild(taskCard);
  }
}

async function createTaskCardElement(task: ITask): Promise<HTMLElement> {
  const assigneeName = await getAssigneeNameRemote(task);
  return await buildTaskCard(task, assigneeName);
}

function getAssigneeNameFromMap(
  task: ITask,
  userMap: Map<number, IUser>,
): string {
  const assignees = task.getAssignees?.() || [];
  if (assignees.length === 0) {
    return "Sem atribuição";
  }

  const firstAssignee = assignees[0];
  const user = userMap.get(firstAssignee.user_id);
  return user ? user.getName().split(" ")[0] : "Sem atribuição";
}

async function getAssigneeNameRemote(task: ITask): Promise<string> {
  const assignees = task.getAssignees?.() || [];
  if (assignees.length === 0) {
    return "Sem atribuição";
  }

  const firstAssignee = assignees[0];
  try {
    const allUsers = await UserService.getUsers();
    const user = allUsers.find((user: IUser) => user.getId() === firstAssignee.user_id);
    return user ? user.getName().split(" ")[0] : "Sem atribuição";
  } catch (error) {
    showInfoBanner("Erro ao carregar informações do utilizador.", "error");
    return "Sem atribuição";
  }
}

async function buildTaskCard(task: ITask, assigneeName: string): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("data-task-id", task.getId().toString());
  card.innerHTML = `
    <h3 class="task-title">${task.getTitle()}</h3>
    <div class="task-meta">
      <span class="task-user">${assigneeName}</span>
      <span class="task-status">${task.getStatus()}</span>
    </div>
  `;

  try {
    const tags = await TaskService.getTaskTags(task.getId());
    if (tags.length > 0) {
      const tagsWrapper = document.createElement("div");
      tagsWrapper.className = "task-tags";

      tags.forEach((tag: any) => {
        const tagPill = document.createElement("span");
        tagPill.className = "task-tag-pill";
        tagPill.textContent = tag.name || "Tag";
        tagsWrapper.appendChild(tagPill);
      });

      card.appendChild(tagsWrapper);
    }
  } catch (error) {
    console.error("Erro ao carregar tags da tarefa:", error);
  }

  setCardBorderColor(card, getCardBorderColor(task.getStatus()));
  card.addEventListener("click", () => loadTaskDetailPage(task.getId()));
  return card;
}
