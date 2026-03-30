import { describe, it, expect } from "vitest";
import { AttachmentService } from "../src/services/attachmentService.js";
import Attachment from "../src/attachments/Attachment.js";

describe("AttachmentService", () => {
  it("adds, retrieves and removes attachments", () => {
    const svc = new AttachmentService();
    const att = new Attachment(3001, 1001, "file.txt", 123, "http://x");

    svc.addAttachment(1001, att);
    const list = svc.getAttachments(1001);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);

    svc.removeAttachment(3001);
    const after = svc.getAttachments(1001);
    expect(after.length).toBe(0);
  });
});