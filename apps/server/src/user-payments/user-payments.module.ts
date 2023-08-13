import { Module } from '@nestjs/common';
import { UserPaymentsService } from './user-payments.service';
import { UserPaymentsController } from './user-payments.controller';

@Module({
  controllers: [UserPaymentsController],
  providers: [UserPaymentsService]
})
export class UserPaymentsModule {}
