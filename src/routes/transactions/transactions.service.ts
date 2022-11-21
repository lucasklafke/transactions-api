import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { UsersService } from '../users/users.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferDto } from './dto/transfer.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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
    if (debitedAccount.balance < createTransactionDto.value) {
      throw new HttpException(
        `balance insufficient, balance: ${debitedAccount.balance} \n value: ${createTransactionDto.value}`,
        409,
      );
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

  create(data: CreateTransactionDto) {
    return this.transactionRepository.create(data);
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
