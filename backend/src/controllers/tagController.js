import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

<<<<<<< HEAD
/* Função para buscar tags */
=======
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
export const getTags = (req, res) => {
  try {
    const tags = tagService.getAllTags();
    res.json(tags);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ error: `Erro ao buscar tags: ${error.message}` });
  }
};

/* Função para criar tag */
=======
    res.status(500).json({ error: error.message });
  }
};

>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
export const createTag = (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim().length === 0) {
<<<<<<< HEAD
      return res.status(400).json({ error: "O nome da tag não pode estar vazio" });
    }

    if (nome.length < 2) {
      return res.status(400).json({ error: "O nome da tag deve ter no mínimo 2 caracteres" });
=======
      return res.status(400).json({ error: "Tag name cannot be empty" });
    }

    if (nome.length < 2) {
      return res.status(400).json({ error: "Tag name must be at least 2 characters" });
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
    }

    const tag = tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
<<<<<<< HEAD
    res.status(400).json({ error: `Erro ao criar tag: ${error.message}` });
  }
};

/* Função para deletar tag */
=======
    res.status(400).json({ error: error.message });
  }
};

>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
export const deleteTag = (req, res) => {
  try {
    const tag = tagService.deleteTag(Number(req.params.id));
    taskService.removeTagFromAllTasks(Number(req.params.id));
<<<<<<< HEAD
    res.status(200).json({ message: "Tag deletada com sucesso", tag });
  } catch (error) {
    res.status(404).json({ error: `Erro ao deletar tag: ${error.message}` });
  }
};

/* Função para buscar tarefas da tag */
=======
    res.json({ message: "Tag deleted successfully", tag });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
export const getTagTasks = (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const tag = tagService.getTagById(tagId);
    
    if (!tag) {
<<<<<<< HEAD
      return res.status(404).json({ error: "Tag não encontrada" });
=======
      return res.status(404).json({ error: "Tag not found" });
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
    }

    const taskRelations = taskService.getTagsByTaskId(tagId);
    const tasks = taskRelations.map((relation) => {
      return taskService.getTaskById(relation.taskId);
    });

    res.json(tasks);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ error: `Erro ao buscar tarefas da tag: ${error.message}` });
=======
    res.status(500).json({ error: error.message });
>>>>>>> f5eb555feb17f2186133b8756f7bc377f7e517c0
  }
};
