import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

/* Função para buscar etiquetas */
export const getTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar etiquetas: ${error.message}` });
  }
};

/* Função para criar etiqueta */
export const createTag = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ error: "O nome da etiqueta não pode estar vazio" });
    }

    if (nome.length < 2) {
      return res.status(400).json({ error: "O nome da etiqueta deve ter no mínimo 2 caracteres" });
    }

    const tag = await tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: `Erro ao criar etiqueta: ${error.message}` });
  }
};

/* Função para deletar etiqueta */
export const deleteTag = async (req, res) => {
  try {
    const tag = await tagService.deleteTag(Number(req.params.id));
    await taskService.removeTagFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Etiqueta deletada com sucesso", tag });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar etiqueta: ${error.message}` });
  }
};

/* Função para buscar tarefas da etiqueta */
export const getTagTasks = async (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const tag = await tagService.getTagById(tagId);
    
    if (!tag) {
      return res.status(404).json({ error: "Tag não encontrada" });
    }

    const taskRelations = await taskService.getTagsByTaskId(tagId);
    const tasks = await Promise.all(
      taskRelations.map((relation) =>
        taskService.getTaskById(relation.id_tarefa),
      ),
    );

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: `Erro ao buscar tarefas da tag: ${error.message}` });
  }
};
