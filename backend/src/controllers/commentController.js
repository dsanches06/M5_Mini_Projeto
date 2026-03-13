import * as commentService from "../services/commentService.js";

export const getComments = (req, res) => {
    const comments = commentService.getAllComments();
    res.json(comments);
};

export const createComment = (req, res) => {
  const comment = commentService.createComment(req.body);
  res.status(201).json(comment);
};

export const updateComment = (req, res) => {
  const comment = commentService.updateComment(Number(req.params.id), req.body);
  res.json(comment);
};

export const deleteComment = (req, res) => {
  commentService.deleteComment(Number(req.params.id));
  res.json({ message: "Comment deleted successfully" });
};
