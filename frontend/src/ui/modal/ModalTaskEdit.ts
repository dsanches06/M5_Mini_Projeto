import { IUser } from "../../models/index.js";
import { ITask } from "../../tasks/index.js";
import {
  createHeadingTitle,
  createSection,
} from "../dom/index.js";
import { renderEditTaskLeftPanel } from "./index.js";
import { renderEditTaskRightPanel } from "./index.js";

export function renderModalEditTask(task: ITask, user?: IUser): void {
  const modal = createSection("modalEditTask") as HTMLElement;
  modal.classList.add("modal");

  const content = createSection("modalEditTaskContent") as HTMLElement;
  content.classList.add("modal-content");

  const closeBtn = document.createElement("span") as HTMLSpanElement;
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const titleHeading = createHeadingTitle(
    "h2",
    `Editar ${task.getTitle()}`,
  ) as HTMLHeadingElement;

  const leftPanel = renderEditTaskLeftPanel(task, user, modal);

  const rightPanel = renderEditTaskRightPanel(task);

  const mainContainer = document.createElement("div");
  mainContainer.className = "edit-task-main";
  mainContainer.style.display = "flex";

  const divider = document.createElement("div");
  divider.className = "edit-task-divider";
  divider.style.width = "1px";
  divider.style.backgroundColor = "#ccc";
  
  mainContainer.append(leftPanel.leftContainer, divider, rightPanel);

  content.append(closeBtn, titleHeading, mainContainer);
  modal.append(content);

  document.body.appendChild(modal);

  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  modal.style.display = "flex";
}
