import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from 'src/@core/domain/auth/password-hasher.port';

@Injectable()
export class BcryptHasherService implements IPasswordHasher {
  private readonly SALT_ROUNDS = 8;

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
