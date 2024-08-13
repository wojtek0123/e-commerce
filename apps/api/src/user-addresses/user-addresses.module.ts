import { Module } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { UserAddressesController } from './user-addresses.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UserAddressesController],
  providers: [UserAddressesService, PrismaService],
})
export class UserAddressesModule {}
