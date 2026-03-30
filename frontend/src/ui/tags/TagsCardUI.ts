import { TagService } from "../../services/index.js";
import { showConfirmDialog, showInfoBanner } from "../../helpers/index.js";

export async function createTagCard(tag: any): Promise<HTMLElement> {
  return await buildTagCard(tag);
}

export async function renderTagsList(
  container: HTMLElement,
  tags: any[],
): Promise<void> {
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(auto-fill, minmax(190px, 1fr))";
  container.style.gridAutoRows = "minmax(min-content, auto)";
  container.style.justifyItems = "start";
  container.style.gap = "1rem";

  if (tags.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Nenhuma tag encontrada.";
    emptyMessage.style.color = "#666";
    container.appendChild(emptyMessage);
    return;
  }

  for (const tag of tags) {
    const tagCard = await createTagCard(tag);
    container.appendChild(tagCard);
  }
}

async function buildTagCard(tag: any): Promise<HTMLElement> {
  const card = document.createElement("div");
  card.className = "task-card tag-card";
  card.setAttribute("data-tag-id", tag.id.toString());

  // Container principal flexível: conteúdo à esquerda, botões à direita
  const mainRow = document.createElement("div");
  mainRow.style.display = "flex";
  mainRow.style.flexDirection = "row";
  mainRow.style.justifyContent = "space-between";
  mainRow.style.alignItems = "flex-start";

  // Conteúdo principal (esquerda)
  const contentCol = document.createElement("div");
  contentCol.className = "task-card-content";

  // ID
  const idSpan = document.createElement("span");
  idSpan.className = "number";
  idSpan.textContent = tag.id.toString();

  // Nome
  const nameSpan = document.createElement("span");
  nameSpan.className = "task-title";
  nameSpan.textContent = tag.name || "Tag sem nome";

  contentCol.append(idSpan, nameSpan);

  // Botões (direita)
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.style.display = "flex";
  buttonContainer.style.flexDirection = "column";
  buttonContainer.style.alignItems = "flex-end";
  buttonContainer.style.gap = "8px";

  card.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest(".icon-button")) {
      return;
    }
    renderTagEditModal(tag);
  });

  // Botão de editar
  const editBtn = document.createElement("button");
  editBtn.className = "icon-button";
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.title = "Editar tag";
  editBtn.setAttribute("aria-label", "Editar tag");
  editBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    await renderTagEditModal(tag);
  });

  // Botão de excluir
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-button";
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteBtn.title = "Excluir tag";
  deleteBtn.setAttribute("aria-label", "Excluir tag");
  deleteBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    const shouldDelete = await showConfirmDialog(
      `Tem certeza que deseja excluir a tag "${tag.name}"?`,
    );
    if (!shouldDelete) {
      return;
    }

    try {
      await TagService.deleteTag(tag.id);
      showInfoBanner(`Tag "${tag.name}" removida.`, "success-banner");
      window.location.reload();
    } catch (error) {
      showInfoBanner("Erro ao excluir tag.", "error-banner");
      console.error(error);
    }
  });

  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);

  // Monta a linha principal: conteúdo à esquerda, botões à direita
  mainRow.appendChild(contentCol);
  mainRow.appendChild(buttonContainer);

  card.appendChild(mainRow);

  return card;
}

async function renderTagEditModal(tag: any): Promise<void> {
  const modal = document.createElement("section");
  modal.className = "tag-modal";

  const content = document.createElement("div");
  content.className = "modal-content";

  const closeBtn = document.createElement("span");
  closeBtn.className = "close";
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", () => modal.remove());

  const title = document.createElement("h2");
  title.textContent = "Editar tag";

  const description = document.createElement("p");
  description.textContent = "Atualize o nome da tag abaixo.";
  description.style.color = "#4b5563";
  description.style.margin = "0.5rem 0 1rem";

  const input = document.createElement("input") as HTMLInputElement;
  input.type = "text";
  input.value = tag.name || "";
  input.placeholder = "Nome da tag";
  input.className = "tag-modal-input";

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "tag-modal-buttons";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "tag-modal-cancel";
  cancelButton.textContent = "Cancelar";
  cancelButton.addEventListener("click", () => modal.remove());

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "tag-modal-save";
  saveButton.textContent = "Salvar";
  saveButton.addEventListener("click", async () => {
    const newName = input.value.trim();
    if (!newName) {
      input.focus();
      return;
    }

    try {
      await TagService.updateTag(tag.id, { name: newName });
      showInfoBanner(`Tag atualizada para "${newName}".`, "success-banner");
      window.location.reload();
      modal.remove();
    } catch (error) {
      showInfoBanner("Erro ao atualizar tag.", "error-banner");
      console.error(error);
    }
  });

  buttonGroup.append(cancelButton, saveButton);
  content.append(closeBtn, title, description, input, buttonGroup);
  modal.appendChild(content);
  document.body.appendChild(modal);
  input.focus();

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}
