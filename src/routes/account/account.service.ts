import { Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly acocuntRepository: AccountRepository) {}

  findAll() {
    return this.acocuntRepository.findMany();
  }

  async getBalance(id: number) {
    const account = await this.acocuntRepository.findByUserId(id);
    return account;
  }

  async findAccountByUserId(userId: number) {
    const account = await this.acocuntRepository.findByUserId(userId);
    return account.Account;
  }

  findOne(id: number) {
    return this.acocuntRepository.findById(id);
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.acocuntRepository.update(id, updateAccountDto);
  }

  remove(id: number) {
    return this.acocuntRepository.delete(id);
  }
}
