import { Module } from '@nestjs/common';
import { UsersModule } from './routes/users/users.module';
import { AccountModule } from './routes/account/account.module';
import { AuthModule } from './routes/auth/auth.module';
import { TransactionsModule } from './routes/transactions/transactions.module';

@Module({
  imports: [UsersModule, AccountModule, AuthModule, TransactionsModule],
})
export class AppModule {}
