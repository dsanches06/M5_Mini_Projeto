import { DashboardConfig } from "../../dashboards/DashboardConfig.js";
import { createSection } from "../dom/CreatePage.js";

export class GenericDashboardUI<T> {
  private container: HTMLElement;
  private items: T[];
  private config: DashboardConfig<T>;

  constructor(items: T[], config: DashboardConfig<T>) {
    this.items = items;
    this.config = config;

    const existing = document.querySelector(
      `#${config.containerId}`,
    ) as HTMLElement | null;
    this.container = existing || createSection(config.containerId);
  }

  render(): HTMLElement {
    this.container.innerHTML = "";
    this.container.classList.add("dash-board");

    const boardHTML = this.generateBoardHTML();
    this.container.innerHTML = boardHTML;
    this.populateItems();
    this.attachEventListeners();

    return this.container;
  }

  private generateBoardHTML(): string {
    const columnsHTML = this.config.columns
      .map(
        (column) => `
        <div class="dash-column">
          <div class="column-header">
            <h2>${column.label}</h2>
            <span class="column-count" data-status="${column.id}">0</span>
          </div>
          <div class="tasks-container" data-status="${column.id}"></div>
        </div>`,
      )
      .join("\n");

    return `<div class="dash-container">\n${columnsHTML}\n      </div>`;
  }

  private populateItems(): void {
    const itemsByColumn: Map<string, T[]> = new Map();

    // Inicializar mapa
    this.config.columns.forEach((column) => {
      itemsByColumn.set(column.id, []);
    });

    // Agrupar items
    this.items.forEach((item) => {
      this.config.columns.forEach((column) => {
        if (column.filterFn(item)) {
          const itemsInColumn = itemsByColumn.get(column.id) || [];
          itemsInColumn.push(item);
          itemsByColumn.set(column.id, itemsInColumn);
        }
      });
    });

    // Preencher colunas
    this.config.columns.forEach((column) => {
      const items = itemsByColumn.get(column.id) || [];
      const container = this.container.querySelector(
        `.tasks-container[data-status="${column.id}"]`,
      ) as HTMLElement | null;
      const countBadge = this.container.querySelector(
        `.column-count[data-status="${column.id}"]`,
      ) as HTMLElement | null;

      if (!container) return;

      if (countBadge) {
        countBadge.textContent = items.length.toString();
      }

      container.innerHTML = "";
      items.forEach((item) => {
        const card = this.config.cardRenderer(item);
        card.setAttribute("data-item-id", this.config.itemId(item).toString());
        container.appendChild(card);
      });
    });
  }

  private attachEventListeners(): void {
    if (!this.config.onCardClick) return;

    const cards = this.container.querySelectorAll(".tasks-container > *");
    cards.forEach((card) => {
      card.addEventListener("click", (event: Event) => {
        event.stopPropagation();
        const itemId = (card as HTMLElement).getAttribute("data-item-id");
        const item = this.items.find(
          (i) => this.config.itemId(i).toString() === itemId,
        );
        if (item && this.config.onCardClick) {
          this.config.onCardClick(item, event as MouseEvent);
        }
      });
    });
  }

  updateItems(items: T[]): void {
    this.items = items;
    this.populateItems();
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}
