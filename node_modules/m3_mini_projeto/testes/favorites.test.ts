import { describe, it, expect } from 'vitest';
import { Favorites } from '../src/utils/Favorites';
import { UserClass } from '../src/models/UserClass';
import { BugTask } from '../src/tasks/BugTask';
import { Task } from '../src/tasks/Task';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { IUser } from '../src/models/IUser';
import type { ITask } from '../src/tasks/ITask';

describe('Favorites', () => {
  it('add, remove, exists e getAll funcionam com utilizadores', () => {
    const fav = new Favorites<IUser>();
    const user1 = new UserClass(1, 'Danilson', 'danilson@email.com');
    const user2 = new UserClass(2, 'Leonor', 'leonor@email.com');
    fav.add(user1);
    fav.add(user2);
    expect(fav.exists(user1)).toBe(true);
    fav.remove(user1);
    expect(fav.exists(user1)).toBe(false);
    expect(fav.getAll()).toEqual([user2]);
  });

  it('remover item inexistente não lança erro nem altera lista para tarefas', () => {
    const fav = new Favorites<ITask>();
    const task1 = new BugTask(1, 'T1', TaskCategory.WORKED);
    fav.add(task1);
    // removing object that is not present
    fav.remove(new Task(999, 'nope', TaskCategory.PERSONAL));
    expect(fav.getAll()).toEqual([task1]);
  });

  it('duplicados são permitidos e remove remove todas as ocorrências', () => {
    const fav = new Favorites<IUser>();
    const user = new UserClass(5, 'Dup', 'dup@e.com');
    fav.add(user);
    fav.add(user);
    expect(fav.getAll()).toEqual([user, user]);
    fav.remove(user);
    expect(fav.getAll()).toEqual([]);
  });
});