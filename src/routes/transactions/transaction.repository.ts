import { Injectable, Logger } from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
      return [debitedAccount, creditedAccount];
    });
  }

  getManyTransactions() {
    return this.PrismaService.transaction.findMany({});
  }
}
