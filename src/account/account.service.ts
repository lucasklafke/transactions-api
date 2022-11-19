import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Account, Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}
  async create() {
    const account = await this.prisma.account.create({
      data: {
        balance: 100,
      },
    });
    return account;
  }

  findAll() {
    return this.prisma.account.findMany({});
  }

  findOne(id: number) {
    return this.prisma.account.findFirst({
      where: { id: id },
    });
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  remove(id: number) {
    return this.prisma.account.delete({
      where: {
        id,
      },
    });
  }
}
