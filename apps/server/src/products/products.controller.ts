import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ProductDto } from './dto/product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProductDto })
  create(@Body() data: Prisma.ProductCreateInput) {
    return this.productsService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: ProductDto, isArray: true })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductDto })
  findOne(@Param('id') id: Prisma.ProductWhereUniqueInput) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ProductDto })
  update(
    @Param('id') id: Prisma.ProductWhereUniqueInput,
    @Body() data: Prisma.ProductUpdateInput
  ) {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProductDto })
  remove(@Param('id') id: Prisma.ProductWhereUniqueInput) {
    return this.productsService.remove(id);
  }
}
