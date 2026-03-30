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
import { renderTagsList } from "./TagsCardUI.js";

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
  await renderTagsList(listSection, allTags);

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
      await renderTagsList(listSection, filteredTags);
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
      await renderTagsList(listSection, allTags);
    } catch (error) {
      showInfoBanner("Erro ao criar tag.", "error-banner");
      console.error(error);
    }
  });

}
