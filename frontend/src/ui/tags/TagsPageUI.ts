import { TagService } from "../../services/index.js";
import {
  addElementInContainer,
  clearContainer,
  createButton,
  createHeadingTitle,
  createInput,
  createSection,
  createSearchContainer,
} from "../dom/index.js";
import { showConfirmDialog, showInfoBanner } from "../../helpers/index.js";

export async function loadTagsPage(tags: any[]): Promise<void> {
  clearContainer("#containerSection");

  addElementInContainer(
    "#containerSection",
    createHeadingTitle("h2", "GESTÃO DE TAGS"),
  );

  const searchContainer = createSearchContainer(
    "searchTagsContainer",
    { id: "searchTag", placeholder: "Procurar tag..." },
    [],
  );
  searchContainer.classList.add("search-add-container");
  addElementInContainer("#containerSection", searchContainer);

  const createInputSection = createSection("tagCreateSection");
  createInputSection.classList.add("form-group");

  const tagLabel = document.createElement("label");
  tagLabel.setAttribute("for", "newTagName");
  tagLabel.textContent = "Nome da tag";

  const createRow = document.createElement("div");
  createRow.className = "tag-create-row";

  const newTagName = createInput("newTagName", "text") as HTMLInputElement;
  newTagName.placeholder = "Ex: Urgente";
  newTagName.autocomplete = "off";

  const createTagBtn = createButton("createTagBtn", "Criar tag", "button");
  createTagBtn.classList.add("btn", "primary");

  createRow.append(newTagName, createTagBtn);

  const newTagError = createSection("newTagNameError");
  newTagError.className = "error-message";

  createInputSection.append(tagLabel, createRow, newTagError);
  addElementInContainer("#containerSection", createInputSection);

  const listSection = createSection("tagsListSection");
  listSection.className = "tags-list-section";
  addElementInContainer("#containerSection", listSection);

  const allTags = await TagService.getTags();
  renderTagsList(allTags);

  const searchTagInput = document.querySelector(
    "#searchTag",
  ) as HTMLInputElement | null;

  if (searchTagInput) {
    searchTagInput.addEventListener("input", async () => {
      const query = searchTagInput.value.trim().toLowerCase();
      const allTags = await TagService.getTags();
      const filteredTags = allTags.filter((tag: any) =>
        (tag.name || "").toLowerCase().includes(query),
      );
      renderTagsList(filteredTags);
    });
  }

  createTagBtn.addEventListener("click", async () => {
    newTagError.textContent = "";
    const name = newTagName.value.trim();
    if (!name) {
      newTagError.textContent = "Informe um nome para a tag.";
      return;
    }

    try {
      await TagService.createTag({ name });
      showInfoBanner(`Tag "${name}" criada com sucesso.`, "success-banner");
      newTagName.value = "";
      const allTags = await TagService.getTags();
      renderTagsList(allTags);
    } catch (error) {
      showInfoBanner("Erro ao criar tag.", "error-banner");
      console.error(error);
    }
  });

}

function renderTagsList(tags: any[]): void {
  const tagsListSection = document.querySelector(
    "#tagsListSection",
  ) as HTMLElement | null;

  if (!tagsListSection) {
    return;
  }

  tagsListSection.innerHTML = "";

  if (tags.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Nenhuma tag encontrada.";
    emptyMessage.style.color = "#666";
    tagsListSection.appendChild(emptyMessage);
    return;
  }

  const list = document.createElement("div");
  list.className = "tags-list";

  tags.forEach((tag: any) => {
    const card = createTagCard(tag);
    list.appendChild(card);
  });

  tagsListSection.appendChild(list);
}

function createTagCard(tag: any): HTMLElement {
  const card = createSection(`tagCard-${tag.id}`);
  card.className = "tag-card";

  const header = createSection(`tagHeader-${tag.id}`);
  header.className = "tag-card-header";

  const meta = document.createElement("span");
  meta.className = "tag-card-id";
  meta.textContent = `ID: ${tag.id}`;

  const name = document.createElement("strong");
  name.className = "tag-card-name";
  name.textContent = tag.name || "Tag sem nome";

  header.append(meta, name);

  const actions = document.createElement("div");
  actions.className = "tag-card-actions";

  const editButton = createButton(`editTag-${tag.id}`, "", "button");
  editButton.className = "tag-card-button edit";
  editButton.innerHTML = `<i class="fas fa-edit"></i>`;
  editButton.title = "Editar tag";
  editButton.setAttribute("aria-label", "Editar tag");
  editButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    await renderTagEditModal(tag);
  });

  const deleteButton = createButton(`deleteTag-${tag.id}`, "", "button");
  deleteButton.className = "tag-card-button delete";
  deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteButton.title = "Excluir tag";
  deleteButton.setAttribute("aria-label", "Excluir tag");
  deleteButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    const shouldDelete = await showConfirmDialog(
      `Tem certeza que deseja excluir a tag "${tag.name}"?`,
    );
    if (!shouldDelete) {
      return;
    }

    try {
      await TagService.deleteTag(tag.id);
      showInfoBanner(`Tag "${tag.name}" removida.`, "success-banner");
      const allTags = await TagService.getTags();
      renderTagsList(allTags);
    } catch (error) {
      showInfoBanner("Erro ao excluir tag.", "error-banner");
      console.error(error);
    }
  });

  actions.append(editButton, deleteButton);

  card.append(header, actions);
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
      const allTags = await TagService.getTags();
      renderTagsList(allTags);
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
