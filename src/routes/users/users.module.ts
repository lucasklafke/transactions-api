import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountService } from 'src/routes/account/account.service';
import { BcryptUtil } from 'src/utils/bcrypt.util';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AccountService, BcryptUtil],
})
export class UsersModule {}
