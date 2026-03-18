import * as taskService from "../services/taskService.js";
import * as tagService from "../services/tagService.js";
import * as commentService from "../services/commentService.js";

/* Função para buscar tarefas */
export const getTasks = (req, res) => {
  const { sort, search } = req.query;
  const tasks = taskService.getAllTasks(search, sort);
  res.json(tasks);
};

/* Função para criar tarefa */
export const createTask = (req, res) => {
  try {
    const { titulo, responsavel } = req.body;

    if (!titulo || titulo.length <= 3) {
      return res.status(400).json({ error: "O título deve ter mais de 3 caracteres" });
    }

    if (!responsavel) {
      return res.status(400).json({ error: "O nome do responsável não pode estar vazio" });
    }

    const task = taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar tarefa: ${error.message}` });
  }
};

/* Função para atualizar tarefa */
export const updateTask = (req, res) => {
  try {
    const { titulo, responsavel } = req.body;

    if (titulo !== undefined && titulo.length <= 3) {
      return res.status(400).json({ error: "O título deve ter mais de 3 caracteres" });
    }

    if (responsavel !== undefined && !responsavel) {
      return res.status(400).json({ error: "O nome do responsável não pode estar vazio" });
    }

    const task = taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: `Erro ao atualizar tarefa: ${error.message}` });
  }
};

/* Função para deletar tarefa */
export const deleteTask = (req, res) => {
  try {
    taskService.deleteTask(Number(req.params.id));
    res.status(200).json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar tarefa: ${error.message}` });
  }
};

/* Função para buscar estatísticas das tarefas */
export const getStats = (req, res) => {
  const stats = taskService.getTaskStats();
  res.json(stats);
};

/* Função para adicionar tag à tarefa */
export const addTagToTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tagId = Number(req.body.tagId);

    if (!tagId) {
      return res.status(400).json({ error: "tagId is required" });
    }

    const tag = tagService.getTagById(tagId);
    if (!tag) {
      return res.status(404).json({ error: "Tag não encontrada" });
    }

    const relation = taskService.addTagToTask(taskId, tagId);
    res.status(201).json(relation);
  } catch (error) {
    res.status(400).json({ error: `Erro ao adicionar tag à tarefa: ${error.message}` });
  }
};

/* Função para remover tag da tarefa */
export const removeTagFromTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tagId = Number(req.body.tagId);

    if (!tagId) {
      return res.status(400).json({ error: "O ID da tag é obrigatório" });
    }

    const relation = taskService.removeTagFromTask(taskId, tagId);
    res.status(200).json({ message: "Tag removida da tarefa com sucesso", relation });
  } catch (error) {
    res.status(400).json({ error: `Erro ao remover tag da tarefa: ${error.message}` });
  }
};

/* Função para buscar tags da tarefa */
export const getTaskTags = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const tags = taskService.getTagsByTaskId(taskId);

    const tagDetails = tags.map((relation) => tagService.getTagById(relation.tagId));
    res.json(tagDetails);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar tags da tarefa: ${error.message}` });
  }
};

/* Função para criar comentário */
export const createComment = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    
    if (!req.body.conteudo || req.body.conteudo.trim().length === 0) {
      return res.status(400).json({ error: "O conteúdo do comentário não pode estar vazio" });
    }
    
    const comment = commentService.createComment(taskId, req.body);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar comentário: ${error.message}` });
  }
};

/* Função para buscar comentários */
export const getComments = (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const comments = commentService.getCommentsByTaskId(taskId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar comentários: ${error.message}` });
  }
};

/* Função para deletar comentário */
export const deleteComment = (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const comment = commentService.deleteComment(commentId);
    res.json({ message: "Comentário deletado com sucesso", comment });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar comentário: ${error.message}` });
  }
};
