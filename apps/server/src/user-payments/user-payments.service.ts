import { Injectable } from '@nestjs/common';
import { CreateUserPaymentDto } from './dto/create-user-payment.dto';
import { UpdateUserPaymentDto } from './dto/update-user-payment.dto';

@Injectable()
export class UserPaymentsService {
  create(createUserPaymentDto: CreateUserPaymentDto) {
    return 'This action adds a new userPayment';
  }

  findAll() {
    return `This action returns all userPayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userPayment`;
  }

  update(id: number, updateUserPaymentDto: UpdateUserPaymentDto) {
    return `This action updates a #${id} userPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} userPayment`;
  }
}
