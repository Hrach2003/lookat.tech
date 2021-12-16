import { v4 as uuid } from 'uuid';

export abstract class Generator {
  static uuid(): string {
    return uuid();
  }

  static filename(extension: string): string {
    return `${this.uuid()}.${extension}`;
  }
}
