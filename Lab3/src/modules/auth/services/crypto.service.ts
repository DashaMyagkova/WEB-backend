import {Injectable} from '@nestjs/common';
import {randomBytes, scrypt, createHash} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class CryptoService {
    public async hashPassword(password: string): Promise<string> {
        // Generate a random salt
        const salt = randomBytes(8).toString('hex');

        // Hash the password with scrypt
        const hashBuffer = await scryptAsync(password, salt, 64) as Buffer;

        // Convert the hash buffer to a hexadecimal string
        const hash = hashBuffer.toString('hex');

        // Return the salt and hash as a single string, separated by a colon
        return `${salt}:${hash}`;
    }

    public async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        // Extract the salt and hash from the stored password string
        const [salt, hash] = hashedPassword.split(':');

        // Hash the password with the stored salt
        const hashBuffer = await scryptAsync(password, salt, 64) as Buffer;

        // Convert the hash buffer to a hexadecimal string
        const computedHash = hashBuffer.toString('hex');

        // Compare the computed hash with the stored hash
        return computedHash === hash;
    }

    public generateRandomHash(numBytes = 32): string {
        const hash = createHash('sha256');
        hash.update(randomBytes(numBytes));
        return hash.digest('hex');
    }
}
