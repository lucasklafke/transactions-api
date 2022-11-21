import { Injectable, Logger } from '@nestjs/common';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly bcryptUtil: BcryptUtil,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    let user: User;
    try {
      user = await this.UsersService.findOneByUsername(username);
      if (!user) return null;
    } catch (error) {
      return null;
    }
    const isPasswordValid = this.bcryptUtil.decrypt(password, user.password);

    if (!isPasswordValid) return null;
    return user;
  }

  login(user: User) {
    const payload = { sub: user.id, username: user.username };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
