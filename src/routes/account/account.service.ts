import { HttpException, Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(private readonly acocuntRepository: AccountRepository) {}

  findAll() {
    return this.acocuntRepository.findMany();
  }

  async getBalance(id: number) {
    const account = await this.acocuntRepository.findByUserId(id);
    if (!account) throw new HttpException('account not found', 404);
    return account.Account.balance;
  }

  async findAccountByUserId(userId: number) {
    const account = await this.acocuntRepository.findByUserId(userId);
    if (!account) throw new HttpException('account not found', 404);
    return account.Account;
  }

  findOne(id: number) {
    const account = this.acocuntRepository.findById(id);
    if (!account) throw new HttpException('account not found', 404);
    return account;
  }
}
