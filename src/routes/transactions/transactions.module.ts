import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountService } from '../account/account.service';
import { TransactionRepository } from './transaction.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    AccountService,
    TransactionRepository,
    PrismaService,
  ],
})
export class TransactionsModule {}
