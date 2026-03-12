import { describe, it, expect } from 'vitest';
import { TagManager } from '../src/utils/TagManager';
import { BugTask } from '../src/tasks/BugTask';
import { FeatureTask } from '../src/tasks/FeatureTask';
import { Task } from '../src/tasks/Task';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { ITask } from '../src/tasks/ITask';

describe('TagManager', () => {
  it('pode adicionar, obter e remover tags de tarefas', () => {
    const tm = new TagManager<ITask>();
    const t1 = new BugTask(1, 'B', TaskCategory.WORKED);
    tm.addTag(t1, 'x');
    tm.addTag(t1, 'y');
    expect(tm.getTags(t1)).toEqual(['x', 'y']);
    tm.removeTag(t1, 'x');
    expect(tm.getTags(t1)).toEqual(['y']);
  });

  it('retorna array vazio para itens sem tags', () => {
    const tm = new TagManager<ITask>();
    expect(tm.getTags(new Task(999, 'nope', TaskCategory.PERSONAL))).toEqual([]);
  });

  it('adicionar tags duplicadas gera duplicatas e removeTag remove todas as ocorrências', () => {
    const tm = new TagManager<ITask>();
    const t1 = new BugTask(2, 'B2', TaskCategory.WORKED);
    tm.addTag(t1, 'dup');
    tm.addTag(t1, 'dup');
    expect(tm.getTags(t1)).toEqual(['dup', 'dup']);
    tm.removeTag(t1, 'dup');
    expect(tm.getTags(t1)).toEqual([]);
  });
});