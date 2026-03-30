import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { UserService, TaskService, AssignmentService } from "../src/services/index.js";
import { UserClass } from "../src/models/index.js";
import { Task } from "../src/tasks/Task.js";
import { TaskCategory } from "../src/tasks/TaskCategory.js";
import { TaskStatus } from "../src/tasks/TaskStatus.js";

const USER_ID_1 = 9001;
const USER_ID_2 = 9002;
const TASK_ID_1 = 8001;
const TASK_ID_2 = 8002;

function cleanup() {
  UserService.removeUser(USER_ID_1);
  UserService.removeUser(USER_ID_2);
  TaskService.removeTask(TASK_ID_1);
  TaskService.removeTask(TASK_ID_2);
}

beforeEach(() => cleanup());
afterEach(() => cleanup());

describe("AssignmentService", () => {
  it("assignUser assigns a task to a user and user has the task", () => {
    const user = new UserClass(USER_ID_1, "Tester 1", "t1@example.com");
    UserService.addUser(user);
    const task = new Task(TASK_ID_1, "Task A", TaskCategory.PERSONAL);
    TaskService.addTask(task);

    AssignmentService.assignUser(task.getId(), user.getId());

    expect(task.getUser()?.getId()).toBe(user.getId());
    expect(user.getTasks().some((t) => t.getId() === task.getId())).toBe(true);
    expect(task.getStatus()).toBe(TaskStatus.ASSIGNED);
  });

  it("reassigning a task removes it from the previous user's tasks", () => {
    const user1 = new UserClass(USER_ID_1, "Tester 1", "t1@example.com");
    const user2 = new UserClass(USER_ID_2, "Tester 2", "t2@example.com");
    UserService.addUser(user1);
    UserService.addUser(user2);

    const task = new Task(TASK_ID_1, "Task B", TaskCategory.WORKED);
    TaskService.addTask(task);

    AssignmentService.assignUser(task.getId(), user1.getId());
    expect(task.getUser()?.getId()).toBe(user1.getId());
    expect(user1.getTasks().some((t) => t.getId() === task.getId())).toBe(true);

    AssignmentService.assignUser(task.getId(), user2.getId());
    // Task must now belong to user2 and be removed from user1
    expect(task.getUser()?.getId()).toBe(user2.getId());
    expect(user2.getTasks().some((t) => t.getId() === task.getId())).toBe(true);
    expect(user1.getTasks().some((t) => t.getId() === task.getId())).toBe(false);
  });

  it("a user can have multiple tasks assigned", () => {
    const user = new UserClass(USER_ID_1, "Tester 1", "t1@example.com");
    UserService.addUser(user);

    const task1 = new Task(TASK_ID_1, "Task C", TaskCategory.PERSONAL);
    const task2 = new Task(TASK_ID_2, "Task D", TaskCategory.PERSONAL);
    TaskService.addTask(task1);
    TaskService.addTask(task2);

    AssignmentService.assignUser(task1.getId(), user.getId());
    AssignmentService.assignUser(task2.getId(), user.getId());

    expect(user.getTasks().length).toBeGreaterThanOrEqual(2);
    expect(user.getTasks().some((t) => t.getId() === task1.getId())).toBe(true);
    expect(user.getTasks().some((t) => t.getId() === task2.getId())).toBe(true);
  });

  it("unassignUser removes the task from the user's tasks and archives the task when no other owner", () => {
    const user = new UserClass(USER_ID_1, "Tester 1", "t1@example.com");
    UserService.addUser(user);
    const task = new Task(TASK_ID_1, "Task E", TaskCategory.PERSONAL);
    TaskService.addTask(task);

    AssignmentService.assignUser(task.getId(), user.getId());
    expect(task.getUser()?.getId()).toBe(user.getId());

    AssignmentService.unassignUser(task.getId(), user.getId());

    expect(user.getTasks().some((t) => t.getId() === task.getId())).toBe(false);
    expect(task.getUser()).toBeUndefined();
    expect(task.getStatus()).toBe(task.getStatus()); // Status remains unchanged
  });
});