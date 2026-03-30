import { describe, it, expect, afterEach } from "vitest";
import { StatisticsService } from "../src/services/statisticsService.js";
import { UserService } from "../src/services/index.js";
import { UserClass } from "../src/models/index.js";
import { Task } from "../src/tasks/Task.js";
import { TaskCategory } from "../src/tasks/TaskCategory.js";

const UID = 8101;
const TID = 8102;

afterEach(() => {
  UserService.removeUser(UID);
});

describe("StatisticsService", () => {
  it("counts users and tasks correctly", () => {
    const user = new UserClass(UID, "Stats", "s@example.com");
    const task = new Task(TID, "Stat Task", TaskCategory.PERSONAL);
    user.createTask(task);
    UserService.addUser(user);

    const svc = new StatisticsService();
    expect(svc.countUsers()).toBeGreaterThanOrEqual(1);
    expect(svc.countTasks()).toBeGreaterThanOrEqual(1);
  });
});