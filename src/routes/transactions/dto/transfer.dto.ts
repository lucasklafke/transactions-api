import { Account } from '@prisma/client';

export class TransferDto {
  debitedAccount: Account;
  creditedAccount: Account;
}
