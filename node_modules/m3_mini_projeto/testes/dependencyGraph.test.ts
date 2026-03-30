import { describe, it, expect } from 'vitest';
import { DependencyGraph } from '../src/utils/DependencyGraph';
import { BugTask } from '../src/tasks/BugTask';
import { FeatureTask } from '../src/tasks/FeatureTask';
import { Task } from '../src/tasks/Task';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { ITask } from '../src/tasks/ITask';

describe('DependencyGraph', () => {
  it('addDependency e getDependencies funcionam', () => {
    const g = new DependencyGraph<ITask>();
    const t1 = new BugTask(1, 'B', TaskCategory.WORKED);
    const t2 = new FeatureTask(2, 'F', TaskCategory.PERSONAL);
    const t3 = new Task(3, 'T', TaskCategory.PERSONAL);

    expect(g.getDependencies(t1)).toEqual([]);
    expect(g.hasDependencies(t1)).toBe(false);

    g.addDependency(t2, t1);
    g.addDependency(t3, t2);
    g.addDependency(t2, t3);

    expect(g.getDependencies(t2)).toEqual([t1, t3]);
    expect(g.hasDependencies(t2)).toBe(true);
    expect(g.hasDependencies(new Task(999, 'nope', TaskCategory.PERSONAL))).toBe(false);
  });

  it('trata ciclos e dependências duplicadas', () => {
    const g = new DependencyGraph<ITask>();
    const a = new BugTask(10, 'A', TaskCategory.WORKED);
    const b = new FeatureTask(11, 'B', TaskCategory.PERSONAL);

    // duplicate dependency
    g.addDependency(a, b);
    g.addDependency(a, b);
    expect(g.getDependencies(a)).toEqual([b, b]);

    // cycle
    g.addDependency(b, a);
    expect(g.getDependencies(b)).toEqual([a]);
    // hasDependencies remains true
    expect(g.hasDependencies(a)).toBe(true);
    expect(g.hasDependencies(b)).toBe(true);
  });
});