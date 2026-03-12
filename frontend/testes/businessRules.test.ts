import { describe, it, expect } from "vitest";
import { BusinessRules } from "../src/services/BusinessRules.js";

describe("BusinessRules", () => {
  it("canUserBeDeactivated returns true only when 0 active tasks", () => {
    expect(BusinessRules.canUserBeDeactivated(0)).toBe(true);
    expect(BusinessRules.canUserBeDeactivated(1)).toBe(false);
  });

  it("canTaskBeCompleted returns false when blocked", () => {
    expect(BusinessRules.canTaskBeCompleted(true)).toBe(false);
    expect(BusinessRules.canTaskBeCompleted(false)).toBe(true);
  });

  it("canAssignTask reflects active flag", () => {
    expect(BusinessRules.canAssignTask(true)).toBe(true);
    expect(BusinessRules.canAssignTask(false)).toBe(false);
  });
});