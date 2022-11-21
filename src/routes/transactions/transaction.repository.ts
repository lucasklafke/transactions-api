import { Injectable, Logger } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '@prisma/client';
@Injectable()
export class TransactionRepository {
  constructor(private readonly PrismaService: PrismaService) {}
  async transfer(data: TransferDto) {
    return this.PrismaService.$transaction(async (prisma) => {
      const debitedAccount = await this.PrismaService.account.update({
        where: {
          id: data.debitedAccount.id,
        },
        data: {
          balance: data.debitedAccount.balance,
        },
      });

      const creditedAccount = await this.PrismaService.account.update({
        where: {
          id: data.creditedAccount.id,
        },
        data: {
          balance: data.creditedAccount.balance,
        },
      });

      const transactionDto: CreateTransactionDto = {
        debitedAccountId: debitedAccount.id,
        creditedAccountId: creditedAccount.id,
        value: data.value,
      };
      const transaction: Transaction =
        await this.PrismaService.transaction.create({
          data: transactionDto,
        });
      return [debitedAccount, creditedAccount];
    });
  }

  create(data: CreateTransactionDto) {
    return this.PrismaService.transaction.create({
      data,
    });
  }

  getManyTransactions() {
    return this.PrismaService.transaction.findMany({});
  }
}
