import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  findById(id: number) {
    return this.PrismaService.account.findUnique({
      where: {
        id: id,
      },
    });
  }

  findMany() {
    return this.PrismaService.account.findMany({});
  }

  update(id: number, updateUserDto: UpdateAccountDto) {
    this.PrismaService.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  delete(id: number) {
    return this.PrismaService.account.delete({
      where: {
        id,
      },
    });
  }
}
