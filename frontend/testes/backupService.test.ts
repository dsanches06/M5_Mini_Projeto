import { describe, it, expect, afterEach } from "vitest";
import { BackupService, UserService, TaskService } from "../src/services/index.js";
import { UserClass } from "../src/models/index.js";
import { Task } from "../src/tasks/Task.js";
import { TaskCategory } from "../src/tasks/TaskCategory.js";

const UID = 7001;
const TID = 6001;

afterEach(() => {
  UserService.removeUser(UID);
  TaskService.removeTask(TID);
});

describe("BackupService", () => {
  it("exports users, tasks and assignments", () => {
    const user = new UserClass(UID, "Backup User", "b@example.com");
    UserService.addUser(user);
    const task = new Task(TID, "Backup Task", TaskCategory.PERSONAL);
    TaskService.addTask(task);

    const bs = new BackupService();
    const all = bs.exportAll();

    expect(all).toHaveProperty("users");
    expect(all).toHaveProperty("tasks");
    expect(all).toHaveProperty("assignments");

    const users = JSON.parse(all.users);
    const tasks = JSON.parse(all.tasks);

    expect(Array.isArray(users)).toBe(true);
    expect(Array.isArray(tasks)).toBe(true);
  });
});