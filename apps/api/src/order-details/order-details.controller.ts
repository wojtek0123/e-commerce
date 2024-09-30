import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { OrderDetail } from './entities/order-detail.entity';

@ApiTags('order-details')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderDetail })
  @ApiOperation({ summary: 'Create an order details' })
  create(
    @Body() data: CreateOrderDetailDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.orderDetailsService.create(data, authHeader);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders details for a specific user' })
  @ApiOkResponse({ type: OrderDetail, isArray: true })
  findAll(@Headers('authorization') authHeader: string) {
    return this.orderDetailsService.findAll(authHeader);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order details for a specific user' })
  @ApiOkResponse({ type: OrderDetail })
  findOne(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    return this.orderDetailsService.findOne(authHeader, id);
  }
}
