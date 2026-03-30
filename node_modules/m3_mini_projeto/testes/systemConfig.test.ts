import { describe, it, expect } from "vitest";
import { SystemConfig } from "../src/services/SystemConfig.js";

describe("SystemConfig", () => {
  it("sets environment and returns info string", () => {
    SystemConfig.appName = "TestApp";
    SystemConfig.version = "1.2.3";
    SystemConfig.setEnvironment("test");

    const info = SystemConfig.getInfo();
    expect(info).toContain("TestApp");
    expect(info).toContain("1.2.3");
    expect(info).toContain("test");
  });
});