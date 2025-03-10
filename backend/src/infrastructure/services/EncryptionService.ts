import crypto from 'crypto';
import { IEncryptionService } from '../../domain/services/IEncryptionService';

export class EncryptionService implements IEncryptionService {
  private algorithm = 'aes-256-cbc';
  private key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);

  async encrypt(data: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  async decrypt(encryptedData: string): Promise<string> {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
} 