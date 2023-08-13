import { Module } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { UserAddressesController } from './user-addresses.controller';

@Module({
  controllers: [UserAddressesController],
  providers: [UserAddressesService]
})
export class UserAddressesModule {}
