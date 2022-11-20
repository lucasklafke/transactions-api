import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptUtil {
  private salt: number;

  constructor() {
    this.salt = 10;
  }
  public encrypt(password: string) {
    const hash = bcrypt.hashSync(password, this.salt);
    return hash;
  }
  public decrypt(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
