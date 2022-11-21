import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountService } from 'src/routes/account/account.service';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { UsersRepository } from './users.repository';
import { AccountRepository } from '../account/account.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    AccountService,
    BcryptUtil,
    UsersRepository,
    AccountRepository,
  ],
})
export class UsersModule {}
