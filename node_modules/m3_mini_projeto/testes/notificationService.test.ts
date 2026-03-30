import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { NotificationService, UserService } from "../src/services/index.js";
import { UserClass } from "../src/models/index.js";
import { SystemLogger } from "../src/logs/SystemLogger.js";

const UID = 10101;

beforeEach(() => SystemLogger.clear());
afterEach(() => {
  UserService.removeUser(UID);
  SystemLogger.clear();
});

describe("NotificationService", () => {
  it("logs a notification when user exists", () => {
    const user = new UserClass(UID, "Notif", "n@example.com");
    UserService.addUser(user);

    NotificationService.notifyUser(UID, "hello");
    const logs = SystemLogger.getLogs();
    expect(logs.length).toBeGreaterThanOrEqual(1);
  });
});