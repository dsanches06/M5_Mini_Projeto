import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AutomationRulesService } from "../src/services/automationRulesService.js";
import { DeadlineService } from "../src/services/deadLineService.js";
import { Task } from "../src/tasks/Task.js";
import { TaskCategory } from "../src/tasks/TaskCategory.js";
import { TaskStatus } from "../src/tasks/TaskStatus.js";
import { SystemLogger } from "../src/logs/SystemLogger.js";

let uniqueTaskId = 50000;

describe("AutomationRulesService", () => {
  beforeEach(() => {
    SystemLogger.clear();
    uniqueTaskId++;
  });

  afterEach(() => {
    SystemLogger.clear();
  });

  it("moves a task to BLOCKED when deadline expired", () => {
    const taskId = uniqueTaskId;
    const task = new Task(taskId, "Old Task", TaskCategory.PERSONAL);
    
    // set deadline to 1 hour in the past
    const now = Date.now();
    const pastDeadline = new Date(now - 1000 * 60 * 60);
    DeadlineService.setDeadline(taskId, pastDeadline);

    // Verify deadline is actually expired before applying rules
    const isExpired = DeadlineService.isExpired(taskId);
    console.log(`Task ID: ${taskId}, Deadline expired: ${isExpired}`);

    AutomationRulesService.applyRules(task);

    expect(task.getStatus()).toBe(TaskStatus.BLOCKED);
  });
});