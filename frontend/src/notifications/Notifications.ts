/* Representação de uma notificação */
export default class Notifications {
  
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }
}
