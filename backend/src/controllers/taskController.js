import * as taskService from "../services/taskService.js";
import * as tagService from "../services/tagService.js";
import * as commentService from "../services/commentService.js";

export const getTasks = (req, res) => {
  const { sort, search } = req.query;
  const tasks = taskService.getAllTasks(search, sort);
  res.json(tasks);
};

export const createTask = (req, res) => {
  try {
    const { titulo, responsavel } = req.body;

    if (!titulo || titulo.length <= 3) {
      return res.status(400).json({ error: "Title must be more than 3 characters" });
    }

    if (!responsavel) {
      return res.status(400).json({ error: "Responsible name cannot be empty" });
    }

    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateTask = (req, res) => {
  try {
    const { titulo, responsavel } = req.body;

    if (titulo !== undefined && titulo.length <= 3) {
      return res.status(400).json({ error: "Title must be more than 3 characters" });
    }

    if (responsavel !== undefined && !responsavel) {
      return res.status(400).json({ error: "Responsible name cannot be empty" });
    }

    const task = taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTask = (req, res) => {
  taskService.deleteTask(Number(req.params.id));
  res.json({ message: "Task deleted successfully" });
};

export const getStats = (req, res) => {
  const stats = taskService.getTaskStats();
  res.json(stats);
};

export const addTagToTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tagId = Number(req.body.tagId);

    if (!tagId) {
      return res.status(400).json({ error: "tagId is required" });
    }

    const tag = tagService.getTagById(tagId);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    const relation = taskService.addTagToTask(taskId, tagId);
    res.status(201).json(relation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeTagFromTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tagId = Number(req.body.tagId);

    if (!tagId) {
      return res.status(400).json({ error: "tagId is required" });
    }

    const relation = taskService.removeTagFromTask(taskId, tagId);
    res.json({ message: "Tag removed from task", relation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTaskTags = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tags = taskService.getTagsByTaskId(taskId);

    const tagDetails = tags.map((relation) => tagService.getTagById(relation.tagId));
    res.json(tagDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    
    if (!req.body.conteudo || req.body.conteudo.trim().length === 0) {
      return res.status(400).json({ error: "Comment content cannot be empty" });
    }
    
    const comment = commentService.createComment(taskId, req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getComments = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const comments = commentService.getCommentsByTaskId(taskId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const comment = commentService.deleteComment(commentId);
    res.json({ message: "Comment deleted successfully", comment });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
