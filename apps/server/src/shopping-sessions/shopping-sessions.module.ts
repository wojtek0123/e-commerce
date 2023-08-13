import { Module } from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import { ShoppingSessionsController } from './shopping-sessions.controller';

@Module({
  controllers: [ShoppingSessionsController],
  providers: [ShoppingSessionsService]
})
export class ShoppingSessionsModule {}
