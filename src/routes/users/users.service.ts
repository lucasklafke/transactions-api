import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountService } from '../account/account.service';
import { Prisma } from '@prisma/client';
import { User } from './entities/user.entity';
import { BcryptUtil } from '../../utils/bcrypt.util';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly bcrypt: BcryptUtil,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const verifyUsernameAlreadyExist = await this.prisma.user.findUnique({
      where: {
        username: createUserDto.username,
      },
    });

    if (verifyUsernameAlreadyExist) {
      throw new HttpException(
        `username ${createUserDto.username} already exists`,
        409,
      );
    }

    const hashedPassword = this.bcrypt.encrypt(createUserDto.password);
    createUserDto.password = hashedPassword;

    const createAccountAndUser = await this.prisma.$transaction(
      async (prisma) => {
        return await this.prisma.account.create({
          data: {
            balance: 100,
            User: {
              connectOrCreate: {
                where: {
                  username: createUserDto.username,
                },
                create: {
                  username: createUserDto.username,
                  password: createUserDto.password,
                },
              },
            },
          },
          include: {
            User: true,
          },
        });
      },
    );
    return createAccountAndUser;
  }

  findAll() {
    return this.prisma.user.findMany({});
  }

  findOne(id: number) {
    const user = this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user)
      throw new HttpException(
        `User ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user)
      throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
    const verifyUsernameAlreadyExist = this.prisma.user.findUnique({
      where: {
        username: updateUserDto.username,
      },
    });
    if (verifyUsernameAlreadyExist)
      throw new HttpException(
        `Username ${updateUserDto.username} already exists`,
        HttpStatus.CONFLICT,
      );

    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException(`User ${id} does not exist`, 404);
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
