import { Injectable } from '@nestjs/common';
import { CreateShoppingSessionDto } from './dto/create-shopping-session.dto';
import { UpdateShoppingSessionDto } from './dto/update-shopping-session.dto';

@Injectable()
export class ShoppingSessionsService {
  create(createShoppingSessionDto: CreateShoppingSessionDto) {
    return 'This action adds a new shoppingSession';
  }

  findAll() {
    return `This action returns all shoppingSessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shoppingSession`;
  }

  update(id: number, updateShoppingSessionDto: UpdateShoppingSessionDto) {
    return `This action updates a #${id} shoppingSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingSession`;
  }
}
