import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountService } from '../account/account.service';
import { TransactionRepository } from './transaction.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountRepository } from '../account/account.repository';
import { UsersService } from '../users/users.service';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { UsersRepository } from '../users/users.repository';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    AccountService,
    TransactionRepository,
    PrismaService,
    AccountRepository,
    UsersService,
    BcryptUtil,
    UsersRepository,
  ],
})
export class TransactionsModule {}
