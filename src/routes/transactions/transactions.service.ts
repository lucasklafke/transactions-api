import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { CreateAccountDto } from '../account/dto/create-account.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferDto } from './dto/transfer.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionRepository: TransactionRepository,
  ) {}
  async transfer(createTransactionDto: CreateTransactionDto) {
    const debitedAccount = await this.accountService.findOne(
      createTransactionDto.debitedAccountId,
    );
    if (debitedAccount.balance < createTransactionDto.value) {
      throw new HttpException(
        `balance insufficient, balance: ${debitedAccount.balance} \n value: ${createTransactionDto.value}`,
        409,
      );
    }
    const creditedAccount = await this.accountService.findOne(
      createTransactionDto.creditedAccountId,
    );
    if (!creditedAccount)
      throw new HttpException('CreditedAccount not found', 404);
    const debitedAccountNewBalance =
      debitedAccount.balance - createTransactionDto.value;
    const creditedAccountNewBalance =
      creditedAccount.balance + createTransactionDto.value;

    debitedAccount.balance = debitedAccountNewBalance;
    creditedAccount.balance = creditedAccountNewBalance;
    const transferDto: TransferDto = {
      debitedAccount,
      creditedAccount,
    };
    const transaction = this.transactionRepository.transfer(transferDto);
    return transaction;
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
