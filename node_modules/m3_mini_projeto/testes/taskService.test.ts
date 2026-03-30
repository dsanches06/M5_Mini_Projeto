import { describe, it, expect, afterEach } from "vitest";
import { TaskService } from "../src/services/taskService.js";
import { Task } from "../src/tasks/Task.js";
import { TaskCategory } from "../src/tasks/TaskCategory.js";
import { TaskStatus } from "../src/tasks/TaskStatus.js";

const TID = 2101;

afterEach(() => TaskService.removeTask(TID));

describe("TaskService", () => {
  it("adds and removes tasks and filters by status", () => {
    const task = new Task(TID, "T1", TaskCategory.PERSONAL);
    TaskService.addTask(task);
    expect(TaskService.getTaskById(TID)).toBeDefined();

    // default created
    expect(TaskService.getTasksUnassign().some((t) => t.getId() === TID)).toBe(true);

    // change status
    task.moveTo(TaskStatus.ASSIGNED);
    expect(TaskService.getTasksAssign().some((t) => t.getId() === TID)).toBe(true);

    TaskService.removeTask(TID);
  });
});