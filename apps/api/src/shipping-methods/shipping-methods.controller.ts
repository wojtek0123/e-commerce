import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShippingMethodsService } from './shipping-methods.service';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ShippingMethod } from './entities/shipping-method.entity';

@ApiTags('shipping-methods')
@Controller('shipping-methods')
export class ShippingMethodsController {
  constructor(
    private readonly shippingMethodsService: ShippingMethodsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create shipping methd' })
  @ApiCreatedResponse({ type: ShippingMethod })
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
  update(
    @Param('id') id: string,
    @Body() updateShippingMethodDto: UpdateShippingMethodDto,
  ) {
    return this.shippingMethodsService.update(id, updateShippingMethodDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ShippingMethod })
  @ApiOperation({ summary: 'Remove specific shipping method' })
  remove(@Param('id') id: string) {
    return this.shippingMethodsService.remove(id);
  }
}
