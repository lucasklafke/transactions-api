import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/database/prisma.service';
import { AccountService } from 'src/account/account.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AccountService],
})
export class UsersModule {}
