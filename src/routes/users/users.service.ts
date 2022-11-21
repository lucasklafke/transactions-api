import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly bcrypt: BcryptUtil,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const verifyUsernameAlreadyExist =
      await this.usersRepository.findByUsername(createUserDto.username);

    if (verifyUsernameAlreadyExist) {
      throw new HttpException(
        `username ${createUserDto.username} already exists`,
        409,
      );
    }

    const hashedPassword = this.bcrypt.encrypt(createUserDto.password);
    createUserDto.password = hashedPassword;

    const createAccountAndUser =
      await this.usersRepository.createUserAndAccount(createUserDto);
    return createAccountAndUser;
  }

  findAll() {
    return this.usersRepository.findMany();
  }
  findOneByUsername(username: string) {
    Logger.log(`1234 ${username}`);

    return this.usersRepository.findByUsername(username);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user)
      throw new HttpException(
        `User ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);
    if (!user)
      throw new HttpException(`User ${id} not found`, HttpStatus.NOT_FOUND);
    const verifyUsernameAlreadyExist = this.usersRepository.findByUsername(
      updateUserDto.username,
    );
    if (verifyUsernameAlreadyExist)
      throw new HttpException(
        `Username ${updateUserDto.username} already exists`,
        HttpStatus.CONFLICT,
      );

    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new HttpException(`User ${id} does not exist`, 404);
    return this.usersRepository.delete(id);
  }
}
