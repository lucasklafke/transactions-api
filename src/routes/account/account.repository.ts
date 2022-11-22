import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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

  findByUserId(userId: number) {
    return this.PrismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        Account: true,
      },
    });
  }

  findMany() {
    return this.PrismaService.account.findMany({});
  }

  update(id: number, updateUserDto: any) {
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
