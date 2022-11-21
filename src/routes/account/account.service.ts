import { Injectable, Logger } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Account, Prisma } from '@prisma/client';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly acocuntRepository: AccountRepository) {}

  findAll() {
    return this.acocuntRepository.findMany();
  }

  async getBalance(id: number) {
    const account = await this.acocuntRepository.findByUserId(id);
    Logger.log(account);
    return account;
  }

  async findAccountByUserId(userId: number) {
    const account = await this.acocuntRepository.findByUserId(userId);
    Logger.log('userauihauih', account);
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
