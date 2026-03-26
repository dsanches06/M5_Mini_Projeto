import { ITask, Task } from "../../tasks/index.js";
import { UserService, CommentService } from "../../services/index.js";
import {
  createButton,
  createHeadingTitle,
  createSection,
} from "../dom/index.js";
import {
  setCardBorderColor,
  getCardBorderColor,
  showInfoBanner,
} from "../../helpers/index.js";
import Comment from "../../comments/Comment.js";
import { TaskStatus } from "../../tasks/TaskStatus.js";

function renderEditCommentModal(comment: Comment, onSave: () => void): void {
  const editModal = createSection("editCommentModal") as HTMLElement;
  editModal.classList.add("modal");
  editModal.style.display = "flex";
  editModal.style.justifyContent = "center";
  editModal.style.alignItems = "center";

  const editContent = createSection("editCommentContent") as HTMLElement;
  editContent.classList.add("modal-content");
  editContent.style.maxWidth = "450px";
  editContent.style.width = "450px";
  editContent.style.padding = "20px";
  editContent.style.maxHeight = "280px";

  const closeBtn = document.createElement("span") as HTMLSpanElement;
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => editModal.remove();

  const editTitle = createHeadingTitle(
    "h3",
    "Editar Comentário",
  ) as HTMLHeadingElement;
  editTitle.style.textAlign = "center";
  editTitle.style.marginBottom = "0.5rem";

  const inputGroup = createSection("section");
  inputGroup.className = "form-group";

  const textInput = document.createElement("textarea") as HTMLTextAreaElement;
  textInput.id = "editCommentInput";
  textInput.rows = 4;
  textInput.value = comment.getMessage();
  textInput.style.width = "100%";
  textInput.style.padding = "8px";
  textInput.style.border = "1px solid #ccc";
  textInput.style.borderRadius = "4px";
  textInput.style.fontFamily = "inherit";

  inputGroup.appendChild(textInput);

  const btnGroup = document.createElement("div");
  btnGroup.style.display = "flex";
  btnGroup.style.gap = "10px";
  btnGroup.style.marginTop = "15px";
  btnGroup.style.justifyContent = "flex-end";

  const saveBtn = createButton(
    "saveEditCommentBtn",
    "Guardar",
    "button",
  ) as HTMLButtonElement;
  saveBtn.onclick = () => {
    const newMsg = textInput.value.trim();
    if (newMsg) {
      comment.setMessage(newMsg);
      try {
        // Atualizar comentário via API (quando CommentService estiver disponível)
        // const updated = await CommentService.updateTaskComment(task.getId(), comment.getId(), { content: newMsg });
        showInfoBanner("INFO: Comentário atualizado com sucesso.", "success-banner");
        onSave();
        editModal.remove();
      } catch (error) {
        console.error("Erro ao atualizar comentário:", error);
        showInfoBanner("ERRO: Não foi possível atualizar o comentário.", "error-banner");
      }
    } else {
      showInfoBanner(
        "ERRO: O comentário não pode estar vazio.",
        "error-banner",
      );
    }
  };

  const cancelBtn = createButton(
    "cancelEditCommentBtn",
    "Cancelar",
    "button",
  ) as HTMLButtonElement;
  cancelBtn.style.backgroundColor = "#6c757d";
  cancelBtn.onclick = () => editModal.remove();

  btnGroup.append(saveBtn, cancelBtn);

  editContent.append(closeBtn, editTitle, inputGroup, btnGroup);
  editModal.append(editContent);
  document.body.appendChild(editModal);

  editModal.onclick = (e) => {
    if (e.target === editModal) editModal.remove();
  };

  editModal.style.display = "flex";
}

export function renderEditTaskRightPanel(task: ITask): HTMLDivElement {
  const rightContainer = document.createElement("div");
  rightContainer.className = "edit-task-right";
  rightContainer.style.flex = "1";
  rightContainer.style.display = "flex";
  rightContainer.style.flexDirection = "column";

  const commentsHeader = createHeadingTitle(
    "h4",
    "COMENTÁRIOS",
  ) as HTMLHeadingElement;
  commentsHeader.style.textAlign = "center";
  commentsHeader.style.marginBottom = "0.5rem";
  rightContainer.appendChild(commentsHeader);

  const commentList = document.createElement("div");
  commentList.className = "comment-list";
  commentList.style.flex = "1";
  commentList.style.overflowY = "auto";
  commentList.style.border = "1px solid #999";
  commentList.style.padding = "0.5rem";
  commentList.style.marginBottom = "0.5rem";
  commentList.style.backgroundColor = "#e9e6e6";

  const commentInput = document.createElement(
    "textarea",
  ) as HTMLTextAreaElement;
  commentInput.rows = 3;
  commentInput.placeholder = "Escreva um comentário";
  commentInput.style.width = "100%";
  commentInput.id = "newCommentText";
  commentInput.style.marginTop = "0.5rem";
  commentInput.style.marginBottom = "0.5rem";

  const sendBtn = createButton(
    "buttonSendComment",
    "Enviar Comentário",
    "button",
  ) as HTMLButtonElement;

  rightContainer.append(commentList, commentInput, sendBtn);

  sendBtn.onclick = () => {
    const msg = commentInput.value.trim();
    if (msg) {
      const userId = task.getAssignees?.()[0]?.user_id ?? 0;
      // TODO: Implementar criação de comentário via API
      // await CommentService.createTaskComment(task.getId(), { userId, message: msg });
      commentInput.value = "";
      refreshComments(task, commentList);
    }
  };

  refreshComments(task, commentList);

  return rightContainer;
}

function refreshComments(task: ITask, commentList: HTMLElement): void {
  commentList.innerHTML = "";
  const comments: any[] = []; // TODO: Obter comentários da API
  // const comments = await CommentService.getTaskComments(task.getId());
  comments.forEach((comment) => {
    // TODO: Obter usuário da API
    const user = null; // await UserService.getUserById(comment.getUserId());
    const item = document.createElement("div");
    item.className = "comment-item";
    const authorName = document.createElement("strong");
    // TODO: Implementar getName() quando user for obtido da API
    authorName.textContent = user ? "[user name]" : "[desconhecido]";

    const commentText = document.createElement("p");
    commentText.textContent = comment.getMessage();
    commentText.style.margin = "0.25rem 0 0 0";

    item.append(authorName, commentText);

    // Aplicar cor do border baseada no taskId
    const taskFromComment = null; // TODO: Obter tarefa do comentário via API
    // TODO: Implementar getStatus() quando task for obtido da API
    const borderColor = getCardBorderColor(TaskStatus.ARCHIVED); // Placeholder color
    setCardBorderColor(item, borderColor);

    item.style.cursor = "pointer";
    item.onclick = () => {
      renderEditCommentModal(comment, () =>
        refreshComments(task, commentList),
      );
    };
    commentList.appendChild(item);
  });
}
