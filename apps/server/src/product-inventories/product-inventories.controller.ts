import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductInventoriesService } from './product-inventories.service';
import { CreateProductInventoryDto } from './dto/create-product-inventory.dto';
import { UpdateProductInventoryDto } from './dto/update-product-inventory.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products inventories')
@Controller('product-inventories')
export class ProductInventoriesController {
  constructor(
    private readonly productInventoriesService: ProductInventoriesService
  ) {}

  @Post()
  create(@Body() createProductInventoryDto: CreateProductInventoryDto) {
    return this.productInventoriesService.create(createProductInventoryDto);
  }

  @Get()
  findAll() {
    return this.productInventoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productInventoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductInventoryDto: UpdateProductInventoryDto
  ) {
    return this.productInventoriesService.update(
      +id,
      updateProductInventoryDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productInventoriesService.remove(+id);
  }
}
