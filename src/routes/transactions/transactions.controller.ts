import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  transfer(@Body() createTransactionDto: CreateTransferDto, @Req() req: any) {
    return this.transactionsService.transfer(
      req.user.userId,
      createTransactionDto,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query('cash-out') cashOut: string,
    @Query('cash-in') cashIn: string,
    @Query('date') date: string,
    @Req() req: any,
  ) {
    const user = req.user;
    const filter = {
      date: '11/21/2022',
      cashOut: 'false',
      cashIn: 'false',
    };
    if (date) {
      const regexDate =
        /^(0[1-9]|1[0-2])|{\/-\-}(0[1-9]|1\d|2\d|3[01])|{\/-\-}(19|20)\d{2}$/;
      if (regexDate.test(date)) {
        filter.date = date;
      }
    }
    if (cashOut) {
      filter.cashOut = 'true';
    }
    if (cashIn) {
      filter.cashIn = 'true';
    }
    return this.transactionsService.findAll(user.id, filter);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }
}
