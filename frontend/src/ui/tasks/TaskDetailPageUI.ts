import { CommentService, ProjectService, TaskAssigneeService, TaskService, UserService } from "../../services/index.js";
import {
  addElementInContainer,
  createSection,
  createHeadingTitle,
  clearContainer,
} from "../dom/index.js";
import { loadTasksPage } from "./TaskPageUI.js";

export async function loadTaskDetailPage(taskId: number): Promise<void> {
  clearContainer("#containerSection");

  const title = "DETALHES DA TAREFA";
  addElementInContainer("#containerSection", createHeadingTitle("h2", title));

  const detailSection = await createTaskDetailSection(taskId);
  addElementInContainer("#containerSection", detailSection);
}

async function createTaskDetailSection(taskId: number): Promise<HTMLElement> {
  const section = createSection("taskDetailSection");
  section.className = "task-detail-page";

  try {
    const [task, users] = await Promise.all([
      TaskService.getTaskById(taskId),
      UserService.getUsers(),
    ]);

    const projectId = task.getProject?.()?.getId?.() ?? 0;
    const project = projectId
      ? await ProjectService.getProjectById(projectId)
      : task.getProject?.();

    const [tags, comments, assignees] = await Promise.all([
      TaskService.getTaskTags(taskId),
      CommentService.getTaskComments(taskId),
      TaskAssigneeService.getTaskAssignees(),
    ]);

    const assigneeList = assignees
      .filter((assignee) => assignee.task_id === taskId)
      .map((assignee) => {
        const user = users.find((user) => user.getId() === assignee.user_id);
        return {
          name: user ? user.getName() : `Usuário ${assignee.user_id}`,
          id: assignee.user_id,
        };
      });

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-detail-info";
    taskInfo.innerHTML = `
      <div class="task-detail-header">
        <div>
          <h3>${task.getTitle()}</h3>
          <span class="task-status task-detail-status">${task.getStatus()}</span>
        </div>
        <div class="task-detail-project">
          <strong>Projeto:</strong>
          <span>${project?.getName ? project.getName() : "Projeto desconhecido"}</span>
        </div>
      </div>
      <div class="task-detail-meta">
        <div><strong>Descrição:</strong> ${task.getDescription() || "Sem descrição"}</div>
        <div><strong>Categoria:</strong> ${task.getTaskCategory ? task.getTaskCategory() : "Sem categoria"}</div>
        <div><strong>Responsáveis:</strong> ${assigneeList.length > 0 ? assigneeList.map((item) => item.name).join(", ") : "Sem responsáveis"}</div>
      </div>
    `;

    const tagsBlock = document.createElement("div");
    tagsBlock.className = "task-detail-tags";
    if (tags.length > 0) {
      tagsBlock.innerHTML = `<strong>Tags:</strong>`;
      const tagsWrapper = document.createElement("div");
      tagsWrapper.className = "task-tags task-detail-tags-list";
      tags.forEach((tag) => {
        const pill = document.createElement("span");
        pill.className = "task-tag-pill";
        pill.textContent = tag.name || "Tag";
        tagsWrapper.appendChild(pill);
      });
      tagsBlock.appendChild(tagsWrapper);
    } else {
      tagsBlock.innerHTML = `<strong>Tags:</strong> <span>Sem tags</span>`;
    }

    const commentsSection = document.createElement("div");
    commentsSection.className = "task-detail-comments";
    commentsSection.innerHTML = `
      <div class="task-detail-comments-header">
        <h4>Comentários</h4>
      </div>
    `;

    const commentsList = document.createElement("div");
    commentsList.className = "task-detail-comments-list";

    if (comments.length > 0) {
      comments.forEach((comment) => {
        const author = users.find((user) => user.getId() === comment.user_id);
        const commentCard = document.createElement("div");
        commentCard.className = "task-detail-comment-item";
        commentCard.innerHTML = `
          <div class="comment-author">${author ? author.getName() : "Usuário desconhecido"}</div>
          <div class="comment-content">${comment.content}</div>
          <div class="comment-meta">${comment.created_at ? new Date(comment.created_at).toLocaleString() : "Sem data"}</div>
        `;
        commentsList.appendChild(commentCard);
      });
    } else {
      const emptyComment = document.createElement("div");
      emptyComment.className = "task-detail-comment-empty";
      emptyComment.textContent = "Nenhum comentário ainda.";
      commentsList.appendChild(emptyComment);
    }

    commentsSection.appendChild(commentsList);

    const commentForm = document.createElement("form");
    commentForm.className = "task-detail-comment-form";
    commentForm.innerHTML = `
      <label for="commentAuthorSelect"><strong>Membro</strong></label>
      <select id="commentAuthorSelect" class="task-detail-comment-select"></select>
      <label for="commentTextArea"><strong>Comentário</strong></label>
      <textarea id="commentTextArea" class="task-detail-comment-input" rows="4" placeholder="Adicionar comentário..."></textarea>
      <button type="submit" class="task-detail-comment-submit">Enviar comentário</button>
    `;

    const authorSelect = commentForm.querySelector("#commentAuthorSelect") as HTMLSelectElement;
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.getId().toString();
      option.textContent = user.getName();
      authorSelect.appendChild(option);
    });

    commentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const contentInput = commentForm.querySelector("#commentTextArea") as HTMLTextAreaElement;
      const selectedUserId = Number(authorSelect.value);
      const content = contentInput.value.trim();

      if (!content) {
        contentInput.focus();
        return;
      }

      const createdComment = await CommentService.createTaskComment(taskId, {
        task_id: taskId,
        user_id: selectedUserId,
        content,
      });

      if (createdComment) {
        await loadTaskDetailPage(taskId);
      }
    });

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "task-detail-back-button";
    backButton.textContent = "← Voltar";
    backButton.addEventListener("click", async () => {
      await loadTasksPage();
    });

    section.appendChild(backButton);
    section.appendChild(taskInfo);
    section.appendChild(tagsBlock);
    section.appendChild(commentsSection);
    section.appendChild(commentForm);
  } catch (error) {
    section.innerHTML = `
      <div class="empty-state">
        <p>Erro ao carregar os detalhes da tarefa.</p>
      </div>
    `;
    console.error("Erro ao carregar detalhes da tarefa:", error);
  }

  return section;
}
