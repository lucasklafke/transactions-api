import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAccountDto: CreateAccountDto) {
    // #todo
    throw new HttpException('route not implemented', 500);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('balance')
  async getBalance(@Req() req: any) {
    const balance = await this.accountService.getBalance(req.user.userId);
    return { balance: balance };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }
}
