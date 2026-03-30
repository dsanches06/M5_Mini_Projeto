import { describe, it, expect, afterEach } from "vitest";
import { DeadlineService } from "../src/services/deadLineService.js";

const TID = 7101;

describe("DeadlineService", () => {
  it("detects expired deadlines and lists expired tasks", () => {
    DeadlineService.setDeadline(TID, new Date(Date.now() - 1000 * 60));
    expect(DeadlineService.isExpired(TID)).toBe(true);
    const expired = DeadlineService.getExpiredTasks();
    expect(expired.includes(TID)).toBe(true);
  });
});