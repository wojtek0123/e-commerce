import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentDetailsService } from './payment-details.service';
import { CreatePaymentDetailDto } from './dto/create-payment-detail.dto';
import { UpdatePaymentDetailDto } from './dto/update-payment-detail.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payment details')
@Controller('payment-details')
export class PaymentDetailsController {
  constructor(private readonly paymentDetailsService: PaymentDetailsService) {}

  @Post()
  create(@Body() createPaymentDetailDto: CreatePaymentDetailDto) {
    return this.paymentDetailsService.create(createPaymentDetailDto);
  }

  @Get()
  findAll() {
    return this.paymentDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentDetailDto: UpdatePaymentDetailDto
  ) {
    return this.paymentDetailsService.update(+id, updatePaymentDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentDetailsService.remove(+id);
  }
}
