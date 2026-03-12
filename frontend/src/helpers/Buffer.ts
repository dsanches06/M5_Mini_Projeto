import { SystemLogger } from "../logs/SystemLogger.js";

/**
 * Buffer estático para acumular contagens e exemplos de erros durante o processamento.
 * Fornece métodos estáticos para incrementar categorias e um método de relatório.
 */
export class Buffer {
  private static unassignedCount = 0;
  private static archivedCount = 0;
  private static alreadyStatusCount = 0;
  private static invalidTransitionCount = 0;
  private static invalidTypeCount = 0;

  private static unassignedExamples: string[] = [];
  private static archivedExamples: string[] = [];
  private static alreadyStatusExamples: string[] = [];
  private static invalidTransitionExamples: string[] = [];
  private static invalidTypeExamples: string[] = [];

  static addUnassigned(title: string) {
    this.unassignedCount++;
    if (this.unassignedExamples.length < 2) this.unassignedExamples.push(title);
  }

  static addArchived(title: string) {
    this.archivedCount++;
    if (this.archivedExamples.length < 2) this.archivedExamples.push(title);
  }

  static addAlreadyStatus(title: string) {
    this.alreadyStatusCount++;
    if (this.alreadyStatusExamples.length < 2)
      this.alreadyStatusExamples.push(title);
  }

  static addInvalidTransition(title: string, current: string, next: string) {
    this.invalidTransitionCount++;
    if (this.invalidTransitionExamples.length < 2)
      this.invalidTransitionExamples.push(`${title} (${current} -> ${next})`);
  }

  static addInvalidType(title: string, type: string) {
    this.invalidTypeCount++;
    if (this.invalidTypeExamples.length < 2)
      this.invalidTypeExamples.push(`${title} [${type}]`);
  }

  static reportProcessSummary() {
    const pluralize = (count: number, singular: string, plural: string) =>
      count === 1 ? `${count} ${singular}` : `${count} ${plural}`;

    if (this.unassignedCount > 0) {
      let msg = `ERRO: ${pluralize(
        this.unassignedCount,
        "tarefa não está atribuída a um utilizador e não pôde ser processada",
        "tarefas não estão atribuídas a um utilizador e não puderam ser processadas",
      )}.`;
      if (this.unassignedExamples.length > 0)
        msg += ` Ex.: ${this.unassignedExamples.join(", ")}.`;
      SystemLogger.log(msg);
      this.unassignedCount = 0;
      this.unassignedExamples = [];
    }

    if (this.archivedCount > 0) {
      let msg = `INFO: ${pluralize(
        this.archivedCount,
        "tarefa já foi arquivada e não pôde ser processada",
        "tarefas já foram arquivadas e não puderam ser processadas",
      )}.`;
      if (this.archivedExamples.length > 0)
        msg += ` Ex.: ${this.archivedExamples.join(", ")}.`;
      SystemLogger.log(msg);
      this.archivedCount = 0;
      this.archivedExamples = [];
    }

    if (this.alreadyStatusCount > 0) {
      let msg = `INFO: ${pluralize(
        this.alreadyStatusCount,
        "tarefa já estava no seu status e não requereu transição",
        "tarefas já estavam no seu status e não requereram transição",
      )}.`;
      if (this.alreadyStatusExamples.length > 0)
        msg += ` Ex.: ${this.alreadyStatusExamples.join(", ")}.`;
      SystemLogger.log(msg);
      this.alreadyStatusCount = 0;
      this.alreadyStatusExamples = [];
    }

    if (this.invalidTransitionCount > 0) {
      let msg = `ERRO: ${pluralize(
        this.invalidTransitionCount,
        "transição de status não é permitida",
        "transições de status não são permitidas",
      )}.`;
      if (this.invalidTransitionExamples.length > 0)
        msg += ` Ex.: ${this.invalidTransitionExamples.join(", ")}.`;
      SystemLogger.log(msg);
      this.invalidTransitionCount = 0;
      this.invalidTransitionExamples = [];
    }

    if (this.invalidTypeCount > 0) {
      let msg = `ERRO: ${pluralize(
        this.invalidTypeCount,
        "tarefa com tipo inválido",
        "tarefas com tipo inválido",
      )}.`;
      if (this.invalidTypeExamples.length > 0)
        msg += ` Ex.: ${this.invalidTypeExamples.join(", ")}.`;
      SystemLogger.log(msg);
      this.invalidTypeCount = 0;
      this.invalidTypeExamples = [];
    }
  }
}

export default Buffer;
