import { describe, it, expect, afterEach } from "vitest";
import { UserService } from "../src/services/userService.js";
import { UserClass } from "../src/models/index.js";

const UID = 4001;

afterEach(() => UserService.removeUser(UID));

describe("UserService", () => {
  it("adds, retrieves and removes a user", () => {
    const user = new UserClass(UID, "U Test", "u@example.com");
    UserService.addUser(user);
    expect(UserService.getUserById(UID)).toBeDefined();

    expect(UserService.getAllUsers().some((u) => u.getId() === UID)).toBe(true);

    const removed = UserService.removeUser(UID);
    expect(removed).toBe(true);
  });
});