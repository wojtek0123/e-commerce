import { Module } from '@nestjs/common';
import { UserInformationsService } from './user-informations.service';
import { UserInformationsController } from './user-informations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserInformationsController],
  providers: [UserInformationsService, PrismaService],
})
export class UserInformationsModule {}
