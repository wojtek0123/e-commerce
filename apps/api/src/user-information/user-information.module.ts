import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserInformationController],
  providers: [UserInformationService, PrismaService],
})
export class UserInformationModule {}
