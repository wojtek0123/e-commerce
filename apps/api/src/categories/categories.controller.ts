import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';
import { Pagination } from '../common/entities/pagination.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ type: Category })
  @ApiOperation({ summary: 'Create a category' })
  @ApiBearerAuth()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get categories' })
  @ApiOkResponse({ type: Pagination<Category>, isArray: true })
  @ApiQuery({ name: 'nameLike', required: false, type: String })
  @ApiQuery({ name: 'nameIn', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  findAll(
    @Query('page') page?: string,
    @Query('size') size?: string,
    @Query('nameLike') nameLike?: string,
    @Query('nameIn') nameIn?: string,
  ) {
    return this.categoriesService.findAll({
      nameLike,
      nameIn,
      page,
      size,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category' })
  @ApiOkResponse({ type: Category })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiBody({ type: UpdateCategoryDto })
  @ApiCreatedResponse({ type: Category })
  @ApiOperation({ summary: 'Update a category' })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOkResponse({ type: Category })
  @ApiOperation({ summary: 'Remove a category' })
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
