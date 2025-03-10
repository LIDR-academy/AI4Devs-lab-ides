export interface IEncryptionService {
  encrypt(data: string): Promise<string>;
  decrypt(encryptedData: string): Promise<string>;
} 