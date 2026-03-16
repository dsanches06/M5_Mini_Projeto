/* Representação de uma notificação */
export default class Notifications {
  private message: string;
  private name?: string;
  private avatar?: string;

  constructor(message: string, name?: string, avatar?: string) {
    this.message = message;
    this.name = name;
    this.avatar = avatar;
  }

  getName(): string {
    return this.name!;
  }

  setName(name: string): void {
    this.name = name;
  }

  getAvatar(): string {
    return this.avatar!;
  }

  setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  getMessage(): string {
    return this.message;
  }
}
