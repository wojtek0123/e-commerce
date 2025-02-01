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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderDetailList } from './entities/order-detail-list.dto';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@ApiTags('order-details')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  @ApiCreatedResponse({ type: OrderDetail })
  @ApiOperation({ summary: 'Create an order details' })
  @UseGuards(RolesGuard)
  @Roles([Role.USER])
  create(
    @Body() data: CreateOrderDetailDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.orderDetailsService.create(data, authHeader);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders details for a specific user' })
  @ApiOkResponse({ type: OrderDetailList, isArray: true })
  @UseGuards(RolesGuard)
  @Roles([Role.USER, Role.ADMIN])
  findAll(@Headers('authorization') authHeader: string) {
    return this.orderDetailsService.findAll(authHeader);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order details for a specific user' })
  @ApiOkResponse({ type: OrderDetail })
  @UseGuards(RolesGuard)
  @Roles([Role.USER, Role.ADMIN])
  findOne(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    return this.orderDetailsService.findOne(authHeader, id);
  }

  @Get('/book/:id')
  @ApiOperation({ summary: 'Get order details for a specific user and book' })
  @ApiOkResponse({ type: OrderDetail })
  @UseGuards(RolesGuard)
  @Roles([Role.USER])
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBearerAuth()
  findOrder(
    @Headers('authorization') authHeader: string,
    @Param('id') bookId: string,
  ) {
    return this.orderDetailsService.findOrder(authHeader, bookId);
  }
}
