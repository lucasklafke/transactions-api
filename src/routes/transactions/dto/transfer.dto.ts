import { Account } from 'src/routes/account/entities/account.entity';

export class TransferDto {
  debitedAccount: Account;
  creditedAccount: Account;
  value: number;
}
