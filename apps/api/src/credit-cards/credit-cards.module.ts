import { Module } from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CreditCardsController],
  providers: [CreditCardsService, PrismaService],
})
export class CreditCardsModule {}
