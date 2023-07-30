import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() data: { name: string; description: string; price: number }) {
    return this.productService.createProduct(data);
  }

  @Get()
  findAll() {
    return this.productService.getProducts();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: { name: string; description: string; price: number }
  ) {
    return this.productService.updateProduct({ where: { id }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.deleteProduct({ id });
  }
}
