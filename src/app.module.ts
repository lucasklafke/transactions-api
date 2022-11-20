import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './routes/users/users.module';
import { AccountModule } from './routes/account/account.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [UsersModule, AccountModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
