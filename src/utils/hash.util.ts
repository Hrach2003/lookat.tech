import * as bcrypt from 'bcrypt';

export abstract class Hash {
  static async generate(string: string) {
    return await bcrypt.hash(string, 10);
  }

  static async compare(string: string, hashedString: string) {
    return await bcrypt.compare(string, hashedString);
  }
}
