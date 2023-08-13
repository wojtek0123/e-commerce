import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Injectable()
export class UserAddressesService {
  create(createUserAddressDto: CreateUserAddressDto) {
    return 'This action adds a new userAddress';
  }

  findAll() {
    return `This action returns all userAddresses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userAddress`;
  }

  update(id: number, updateUserAddressDto: UpdateUserAddressDto) {
    return `This action updates a #${id} userAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAddress`;
  }
}
