/* Logger do sistema */
export class SystemLogger {
  private static logs: string[] = [];

  static log(message: string) {
    this.logs.push(message);
  }

  static getLogs(): string[] {
    return this.logs;
  }

  static clear() {
    this.logs = [];
  }
}
