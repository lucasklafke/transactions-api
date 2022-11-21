import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAccountDto: CreateAccountDto) {
    // #todo
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('balance')
  async getBalance(@Req() req: any) {
    Logger.log('aa', req.user.userId);
    const { Account } = await this.accountService.getBalance(req.user.userId);
    return { balance: Account.balance };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
