import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { processTask } from '../src/utils/TaskUtils';
import { BugTask } from '../src/tasks/BugTask';
import { FeatureTask } from '../src/tasks/FeatureTask';
import { Task } from '../src/tasks/Task';
import { TaskCategory } from '../src/tasks/TaskCategory';
import { UserClass } from '../src/models/UserClass';
import { UserRole } from '../src/security/UserRole';
import { UserService } from '../src/services/userService';
import { SystemLogger } from '../src/logs/SystemLogger';
import { TaskStatus } from '../src/tasks/TaskStatus';

describe('TaskUtils.processTask', () => {
  beforeEach(() => {
    SystemLogger.clear();
  });

  afterEach(() => {
    // Limpar usuários adicionados durante os testes
    UserService.removeUser(1);
    UserService.removeUser(99);
    UserService.removeUser(100);
  });

  it('não processa Bug com título inválido (muito curto)', () => {
    const bug = new BugTask(1, 'ab', TaskCategory.WORKED);
    const user = new UserClass(1, 'DevUser', 'dev@local');
    // assign user but title is invalid
    bug.setUser(user);
    UserService.addUser(user);

    processTask(bug);

    expect(bug.getStatus()).toBe(TaskStatus.CREATED);
    const logs = SystemLogger.getLogs().join('\n');
    expect(logs).toContain('ERRO: Bug 1 tem título inválido');
    // ensure user was notified about failure
    expect(logs).toContain('NOTIF -> DevUser');
  });

  it('processa Bug com título válido e utilizador atribuído e notifica administradores', () => {
    const bug = new BugTask(2, 'Bug com descrição suficiente', TaskCategory.WORKED);
    const user = new UserClass(1, 'DevUser', 'dev@local');
    const admin = new UserClass(99, 'Admin', 'admin@local', UserRole.ADMIN);

    // register users so notifications to admins work
    UserService.addUser(user);
    UserService.addUser(admin);

    bug.setUser(user);

    processTask(bug);

    expect(bug.getStatus()).toBe(TaskStatus.ASSIGNED);
    const logs = SystemLogger.getLogs().join('\n');
    // should have an auto-log for bugs
    expect(logs).toContain('AUTO-LOG: Bug 2 processado');
    // assigned user should receive a notification on success
    expect(logs).toContain('NOTIF -> DevUser');
    // admin should be notified on bug success
    expect(logs).toContain('NOTIF -> Admin');
  });

  it('processa Feature com título curto, emite WARN e continua', () => {
    const feature = new FeatureTask(3, 'Hi', TaskCategory.PERSONAL);
    const user = new UserClass(100, 'FeatureOwner', 'f@local');
    UserService.addUser(user);
    feature.setUser(user);

    processTask(feature);

    expect(feature.getStatus()).toBe(TaskStatus.ASSIGNED);
    const logs = SystemLogger.getLogs().join('\n');
    expect(logs).toContain('WARN: Feature 3 possui título curto');
  });

  it('processa Tarefa genérica com título válido (comportamento genérico)', () => {
    const t = new Task(4, 'Tarefa genérica', TaskCategory.PERSONAL);

    processTask(t);

    expect(t.getStatus()).toBe(TaskStatus.ASSIGNED);
    const logs = SystemLogger.getLogs().join('\n');
    // valida que a tarefa foi processada corretamente
    expect(logs).toContain('A tarefa Tarefa genérica do tipo Task');
    expect(logs).toContain('foi processado');
  });
});