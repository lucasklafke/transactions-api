import { HttpException, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterDto } from './dto/filter.dto';
import { TransferDto } from './dto/transfer.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly accountService: AccountService,
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UsersService,
  ) {}

  async transfer(userId: number, createTransactionDto: CreateTransferDto) {
    const debitedAccount = await this.accountService.findAccountByUserId(
      userId,
    );
    if (!debitedAccount)
      throw new HttpException('CreditedAccount not found', 404);
    if (debitedAccount.balance < createTransactionDto.value) {
      throw new HttpException(`insufficient balance`, 409);
    }

    const userToCredit = await this.userService.findOneByUsername(
      createTransactionDto.usernameToCredit,
    );
    if (!userToCredit) throw new HttpException('userToCredit not found', 404);

    const creditedAccount = await this.accountService.findAccountByUserId(
      userToCredit.id,
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
      value: createTransactionDto.value,
    };
    if (debitedAccount.id === creditedAccount.id) {
      throw new HttpException('You cannot transfer to yourself', 409);
    }
    return this.transactionRepository.transfer(transferDto);
  }

  async create(data: CreateTransactionDto) {
    const transaction = await this.transactionRepository.create(data);
    if (!transaction)
      throw new HttpException('error creating transaction', 500);

    return transaction;
  }

  async findAll(userId: number, filter: FilterDto) {
    const account = await this.accountService.findAccountByUserId(userId);
    const cashInTransactions = [];
    const cashOutTransactions = [];
    if (filter.cashIn !== 'false') {
      cashInTransactions.push(
        await this.transactionRepository.findAllCashIn(account.id, filter.date),
      );
    } else if (filter.cashOut !== 'false') {
      cashOutTransactions.push(
        await this.transactionRepository.findAllCashout(
          account.id,
          filter.date,
        ),
      );
    } else {
      return this.transactionRepository.findAll(account.id);
    }

    const transactions = [...cashInTransactions, ...cashOutTransactions];
    if (transactions.length === 0) {
      throw new HttpException('transactions not found', 404);
    }
    return transactions;
  }

  async findOne(id: number) {
    const transaction: Transaction = await this.transactionRepository.findOne(
      id,
    );
    if (!transaction) throw new HttpException('transaction not found', 404);

    return transaction;
  }
}
