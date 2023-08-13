import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductCategory } from './entities/product-category.entity';

@ApiTags('product categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService
  ) {}

  @Post()
  @ApiCreatedResponse({ type: ProductCategory })
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get()
  @ApiOkResponse({ type: ProductCategory, isArray: true })
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductCategory })
  findOne(@Param('id') id: string) {
    return this.productCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ProductCategory })
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto
  ) {
    return this.productCategoriesService.update(+id, updateProductCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProductCategory })
  remove(@Param('id') id: string) {
    return this.productCategoriesService.remove(+id);
  }
}
