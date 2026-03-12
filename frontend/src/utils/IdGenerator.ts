/* Gerador de IDs sequencial global */
export class IdGenerator {
  private static taskCounter: number = 0;
  private static userCounter: number = 0;

  /* Gera um novo ID para tarefas */
  static generateTaskId(): number {
    this.taskCounter += 1;
    return this.taskCounter;
  }

  /* Gera um novo ID para utilizadores */
  static generateUserId(): number {
    this.userCounter += 1;
    return this.userCounter;
  }

  /* Reinicia os contadores (útil para testes) */
  static reset(): void {
    this.taskCounter = 0;
    this.userCounter = 0;
  }
}
