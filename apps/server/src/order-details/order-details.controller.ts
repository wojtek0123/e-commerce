import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OrderDetail } from './entities/order-detail.entity';

@ApiTags('order details')
@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderDetail })
  create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailsService.create(createOrderDetailDto);
  }

  @Get()
  @ApiOkResponse({ type: OrderDetail, isArray: true })
  findAll() {
    return this.orderDetailsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: OrderDetail })
  findOne(@Param('id') id: string) {
    return this.orderDetailsService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: OrderDetail })
  update(
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto
  ) {
    return this.orderDetailsService.update(+id, updateOrderDetailDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: OrderDetail })
  remove(@Param('id') id: string) {
    return this.orderDetailsService.remove(+id);
  }
}
