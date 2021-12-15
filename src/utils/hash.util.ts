import * as bcrypt from 'bcrypt';

type GenerateHash = (string: string) => Promise<string>;
type CompareHash = (string: string, hashedString: string) => Promise<boolean>;

export const generateHash: GenerateHash = async (string) => {
  return await bcrypt.hash(string, 10);
};

export const compareHash: CompareHash = async (string, hashedString) => {
  return await bcrypt.compare(string, hashedString);
};
