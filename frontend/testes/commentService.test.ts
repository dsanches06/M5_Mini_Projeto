import { describe, it, expect } from "vitest";
import { CommentService } from "../src/services/commentService.js";

describe("CommentService", () => {
  it("adds, retrieves and deletes comments", () => {
    CommentService.addComment(2001, 42, "hello");
    CommentService.addComment(2001, 43, "hi");

    const comments = CommentService.getComments(2001);
    expect(comments.length).toBe(2);

    const idToDelete = comments[0].getId();
    CommentService.deleteComment(idToDelete);
    const after = CommentService.getComments(2001);
    expect(after.length).toBe(1);
  });
});