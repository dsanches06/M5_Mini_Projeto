import { describe, it, expect } from 'vitest';
import { PriorityManager } from '../src/utils/PriorityManager';
import { BugTask } from '../src/tasks/BugTask';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { ITask } from '../src/tasks/ITask';

describe('PriorityManager', () => {
  it('set e getPriority funcionam e retornam undefined para desconhecido', () => {
    const pm = new PriorityManager<ITask>();
    const t = new BugTask(1, 'B', TaskCategory.WORKED);
    expect(pm.getPriority(t)).toBeUndefined();
    pm.setPriority(t, 5);
    expect(pm.getPriority(t)).toBe(5);
  });
});