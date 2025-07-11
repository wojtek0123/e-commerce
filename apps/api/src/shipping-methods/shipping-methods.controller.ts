import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ShippingMethodsService } from './shipping-methods.service';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ShippingMethod } from './entities/shipping-method.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@ApiTags('shipping-methods')
@Controller('shipping-methods')
export class ShippingMethodsController {
  constructor(
    private readonly shippingMethodsService: ShippingMethodsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create shipping methd' })
  @ApiCreatedResponse({ type: ShippingMethod })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  create(@Body() createShippingMethodDto: CreateShippingMethodDto) {
    return this.shippingMethodsService.create(createShippingMethodDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipping methods' })
  @ApiOkResponse({ type: ShippingMethod })
  findAll() {
    return this.shippingMethodsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific shipping method' })
  @ApiOkResponse({ type: ShippingMethod })
  findOne(@Param('id') id: string) {
    return this.shippingMethodsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specific shipping method' })
  @ApiCreatedResponse({ type: ShippingMethod })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateShippingMethodDto: UpdateShippingMethodDto,
  ) {
    return this.shippingMethodsService.update(id, updateShippingMethodDto);
  }

  @Delete()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Remove shipping methods' })
  @ApiQuery({ name: 'ids', required: true })
  @ApiBearerAuth()
  remove(@Query('ids') ids: string) {
    return this.shippingMethodsService.remove(ids);
  }
}
