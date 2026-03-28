import { SprintService } from "../../services/index.js";

export interface SprintStatsResponse {
  totalSprints: number;
}

export async function showSprintsCounters(
  type?: string,
  sprints?: any[],
): Promise<void> {
  if (type === "filtrados" && sprints) {
    countAllSprints("#allSprintsCounter", sprints.length);
    countFilterSprints("#filterSprintsCounter", type!, sprints.length);
  } else {
    await countAllSprints("#allSprintsCounter");
    countFilterSprints("#filterSprintsCounter", type!);
  }
}

/* Contador de sprints filtrados */
function countFilterSprints(id: string, type: string, count?: number): void {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (section) {
    if (count !== undefined) {
      section.textContent = `${count}`;
    } else {
      section.textContent = "0";
    }
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}

/* Contador de todos os sprints */
async function countAllSprints(
  id: string,
  overrideValue?: number,
): Promise<void> {
  const section = document.querySelector(`${id}`) as HTMLElement;
  if (overrideValue !== undefined) {
    if (section) {
      section.textContent = `${overrideValue}`;
    }
    return;
  }
  const sprints = await SprintService.getSprints();
  if (section) {
    section.textContent = `${sprints.length}`;
  } else {
    console.warn(`Elemento ${id} não foi encontrado no DOM.`);
  }
}
