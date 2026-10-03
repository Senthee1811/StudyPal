import crypto from 'node:crypto';

export class CryptoUtil {
  static async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`argon2id_scrypt$${salt}$${derivedKey.toString('hex')}`);
      });
    });
  }

  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return false;
    const [, salt, originalKeyHex] = parts;

    return new Promise((resolve) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) return resolve(false);
        const originalBuffer = Buffer.from(originalKeyHex, 'hex');
        resolve(crypto.timingSafeEqual(derivedKey, originalBuffer));
      });
    });
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static generateSecureToken(length = 40): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
