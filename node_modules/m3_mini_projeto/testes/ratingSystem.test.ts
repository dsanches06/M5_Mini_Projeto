import { describe, it, expect } from 'vitest';
import { RatingSystem } from '../src/utils/RatingSystem';
import { BugTask } from '../src/tasks/BugTask';
import { Task } from '../src/tasks/Task';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { ITask } from '../src/tasks/ITask';

describe('RatingSystem', () => {
  it('getAverage retorna 0 sem classificações e classifica corretamente', () => {
    const rs = new RatingSystem<ITask>();
    const t = new BugTask(1, 'B', TaskCategory.WORKED);
    expect(rs.getRatings(t)).toEqual([]);
    expect(rs.getAverage(t)).toBe(0);
    rs.rate(t, 5);
    rs.rate(t, 3);
    expect(rs.getRatings(t)).toEqual([5, 3]);
    expect(rs.getAverage(t)).toBe((5 + 3) / 2);
  });

  it('trata múltiplos itens independentemente', () => {
    const rs = new RatingSystem<ITask>();
    const t1 = new BugTask(1, 'B', TaskCategory.WORKED);
    const t2 = new Task(2, 'T', TaskCategory.PERSONAL);
    rs.rate(t1, 4);
    rs.rate(t2, 2);
    expect(rs.getAverage(t1)).toBe(4);
    expect(rs.getAverage(t2)).toBe(2);
  });

  it('aceita classificações não inteiras e calcula média corretamente', () => {
    const rs = new RatingSystem<ITask>();
    const t = new BugTask(5, 'NonInt', TaskCategory.WORKED);
    rs.rate(t, 4.5);
    rs.rate(t, 3.25);
    expect(rs.getRatings(t)).toEqual([4.5, 3.25]);
    expect(rs.getAverage(t)).toBeCloseTo((4.5 + 3.25) / 2);
  });
});