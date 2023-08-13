import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserPaymentsService } from './user-payments.service';
import { CreateUserPaymentDto } from './dto/create-user-payment.dto';
import { UpdateUserPaymentDto } from './dto/update-user-payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user payments')
@Controller('user-payments')
export class UserPaymentsController {
  constructor(private readonly userPaymentsService: UserPaymentsService) {}

  @Post()
  create(@Body() createUserPaymentDto: CreateUserPaymentDto) {
    return this.userPaymentsService.create(createUserPaymentDto);
  }

  @Get()
  findAll() {
    return this.userPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPaymentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserPaymentDto: UpdateUserPaymentDto
  ) {
    return this.userPaymentsService.update(+id, updateUserPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPaymentsService.remove(+id);
  }
}
