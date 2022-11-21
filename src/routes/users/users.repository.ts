import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UsersRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  findById(id: number) {
    return this.PrismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  findMany() {
    return this.PrismaService.user.findMany({});
  }

  findByUsername(username: string) {
    return this.PrismaService.user.findFirst({
      where: {
        username,
      },
    });
  }

  createUserAndAccount(data: CreateUserDto) {
    return this.PrismaService.$transaction(async (prisma) => {
      return await this.PrismaService.account.create({
        data: {
          balance: 100,
          User: {
            connectOrCreate: {
              where: {
                username: data.username,
              },
              create: {
                username: data.username,
                password: data.password,
              },
            },
          },
        },
        include: {
          User: true,
        },
      });
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.PrismaService.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  delete(id: number) {
    return this.PrismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
