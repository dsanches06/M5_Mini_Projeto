import { describe, it, expect } from 'vitest';
import { EntityList } from '../src/utils/EntityList';
import { UserClass } from '../src/models/UserClass';
import { BugTask } from '../src/tasks/BugTask';
import { FeatureTask } from '../src/tasks/FeatureTask';
import { Task } from '../src/tasks/Task';
import { TaskCategory } from '../src/tasks/TaskCategory';
import type { IUser } from '../src/models/IUser';
import type { ITask } from '../src/tasks/ITask';

describe('EntityList', () => {
  it('começa vazio e pode adicionar utilizadores e tarefas', () => {
    const user1 = new UserClass(1, 'Danilson', 'danilson@email.com');
    const user2 = new UserClass(2, 'Leonor', 'leonor@email.com');
    const user3 = new UserClass(3, 'Adriano', 'adriano@email.com');

    const task1 = new BugTask(1, 'Tarefa Bug', TaskCategory.WORKED);
    const task2 = new FeatureTask(2, 'Tarefa Feature', TaskCategory.PERSONAL);
    const task3 = new Task(3, 'Tarefa Task', TaskCategory.PERSONAL);

    const userList = new EntityList<IUser>();
    expect(userList.getAll()).toEqual([]);
    userList.add(user1);
    userList.add(user2);
    expect(userList.getAll()).toEqual([user1, user2]);

    const taskList = new EntityList<ITask>();
    expect(taskList.getAll()).toEqual([]);
    taskList.add(task1);
    expect(taskList.getAll()).toEqual([task1]);
  });

  it('mantém a ordem de inserção para utilizadores e tarefas', () => {
    const user1 = new UserClass(1, 'Danilson', 'danilson@email.com');
    const user2 = new UserClass(2, 'Leonor', 'leonor@email.com');
    const user3 = new UserClass(3, 'Adriano', 'adriano@email.com');

    const task1 = new BugTask(1, 'Tarefa Bug', TaskCategory.WORKED);
    const task2 = new FeatureTask(2, 'Tarefa Feature', TaskCategory.PERSONAL);
    const task3 = new Task(3, 'Tarefa Task', TaskCategory.PERSONAL);

    const userList = new EntityList<IUser>();
    userList.add(user1);
    userList.add(user2);
    userList.add(user3);
    expect(userList.getAll()).toEqual([user1, user2, user3]);

    const taskList = new EntityList<ITask>();
    taskList.add(task1);
    taskList.add(task2);
    taskList.add(task3);
    expect(taskList.getAll()).toEqual([task1, task2, task3]);
  });

  it('permite itens duplicados (mesma referência)', () => {
    const user = new UserClass(10, 'Dup', 'dup@e.com');
    const userList = new EntityList<IUser>();
    userList.add(user);
    userList.add(user);
    expect(userList.getAll()).toEqual([user, user]);

    const task = new BugTask(10, 'DupT', TaskCategory.WORKED);
    const taskList = new EntityList<ITask>();
    taskList.add(task);
    taskList.add(task);
    expect(taskList.getAll()).toEqual([task, task]);
  });
});