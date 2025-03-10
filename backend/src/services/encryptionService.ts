import crypto from 'crypto';

// In a production environment, these should be stored in environment variables
// and not in the code
const ENCRYPTION_KEY_RAW =
  process.env.ENCRYPTION_KEY || 'your-encryption-key-must-be-32-chars-long'; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// Ensure the key is exactly 32 bytes (256 bits) for AES-256
const getEncryptionKey = (): Buffer => {
  // If key is too short, pad it; if too long, truncate it
  let key = ENCRYPTION_KEY_RAW;
  if (key.length < 32) {
    key = key.padEnd(32, '0'); // Pad with zeros if too short
  } else if (key.length > 32) {
    key = key.substring(0, 32); // Truncate if too long
  }
  return Buffer.from(key);
};

/**
 * Encrypts sensitive data using AES-256-CBC
 * @param text The text to encrypt
 * @returns Encrypted text as a base64 string
 */
export const encrypt = (text: string): string => {
  if (!text) return text;

  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Get properly sized encryption key
    const key = getEncryptionKey();

    // Create cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Combine IV and encrypted data
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts data that was encrypted with the encrypt function
 * @param encryptedText The encrypted text (IV:encryptedData)
 * @returns The decrypted text
 */
export const decrypt = (encryptedText: string): string => {
  if (!encryptedText) return encryptedText;
  if (!encryptedText.includes(':')) return encryptedText; // Not encrypted with our method

  try {
    // Split IV and encrypted data
    const [ivHex, encryptedData] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    // Get properly sized encryption key
    const key = getEncryptionKey();

    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash a password using bcrypt or a similar algorithm
 * Note: In a real application, use a proper password hashing library like bcrypt
 * @param password The password to hash
 * @returns Hashed password
 */
export const hashPassword = (password: string): string => {
  // This is a simplified example. In production, use bcrypt or Argon2
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify a password against a hash
 * @param password The password to verify
 * @param hashedPassword The stored hashed password
 * @returns True if the password matches, false otherwise
 */
export const verifyPassword = (
  password: string,
  hashedPassword: string,
): boolean => {
  // This is a simplified example. In production, use bcrypt or Argon2
  const [salt, storedHash] = hashedPassword.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return storedHash === hash;
};
