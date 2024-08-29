import { Controller, Get, Param } from '@nestjs/common';
import { ProductInventoriesService } from './product-inventories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('product-inventories')
@Controller('product-inventories')
export class ProductInventoriesController {
  constructor(
    private readonly productInventoriesService: ProductInventoriesService
  ) {}

  // @Post()
  // create(@Body() createProductInventoryDto: CreateProductInventoryDto) {
  //   return this.productInventoriesService.create(createProductInventoryDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.productInventoriesService.findAll();
  // }

  @Get(':bookId')
  findOne(@Param('bookId') bookId: string) {
    return this.productInventoriesService.findOne(+bookId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductInventoryDto: UpdateProductInventoryDto) {
  //   return this.productInventoriesService.update(+id, updateProductInventoryDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productInventoriesService.remove(+id);
  // }
}
