import { describe, it, expect } from 'vitest';
import { SimpleCache } from '../src/utils/SimpleCache';
import { UserClass } from '../src/models/UserClass';
import { BugTask } from '../src/tasks/BugTask';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { IUser } from '../src/models/IUser';
import type { ITask } from '../src/tasks/ITask';

describe('SimpleCache', () => {
  it('retorna undefined para chaves desconhecidas e armazena valores de utilizador', () => {
    const cache = new SimpleCache<number, IUser>();
    const user1 = new UserClass(1, 'Danilson', 'danilson@email.com');
    expect(cache.get(1)).toBeUndefined();
    cache.set(1, user1);
    expect(cache.get(1)).toBe(user1);
  });

  it('substitui chaves existentes ao definir novamente', () => {
    const cache = new SimpleCache<number, IUser>();
    const user1 = new UserClass(1, 'Danilson', 'danilson@email.com');
    const user2 = new UserClass(1, 'Danilson2', 'danilson2@email.com');
    cache.set(1, user1);
    cache.set(1, user2);
    expect(cache.get(1)).toBe(user2);
  });

  it('pode armazenar tarefas como valores', () => {
    const cache = new SimpleCache<number, ITask>();
    const t = new BugTask(3, 'C', TaskCategory.WORKED);
    cache.set(3, t);
    expect(cache.get(3)).toBe(t);
  });
});