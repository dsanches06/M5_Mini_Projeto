import { describe, it, expect, afterEach } from "vitest";
import { SearchService } from "../src/services/searchService.js";
import { TaskService } from "../src/services/index.js";
import { Task } from "../src/tasks/Task.js";
import { TaskCategory } from "../src/tasks/TaskCategory.js";
import { TaskStatus } from "../src/tasks/TaskStatus.js";

const TID = 9101;

afterEach(() => TaskService.removeTask(TID));

describe("SearchService", () => {
  it("searches by title and status", () => {
    const task = new Task(TID, "FindMeTitle", TaskCategory.PERSONAL);
    TaskService.addTask(task);

    const svc = new SearchService();
    const byTitle = svc.searchByTitle("FindMe");
    expect(byTitle.some((t) => t.getId() === TID)).toBe(true);

    task.moveTo(TaskStatus.ASSIGNED);
    const byStatus = svc.searchByStatus(TaskStatus.ASSIGNED);
    expect(byStatus.some((t) => t.getId() === TID)).toBe(true);
  });
});