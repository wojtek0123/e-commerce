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
import { BooksService } from './books.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BookEntity } from './entities/book.entity';
import { UpdateBookBodyDto } from './dto/update-body.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Role, Tag } from '@prisma/client';
import { RolesGuard } from '../common/guards/role.guard';

import { Reflector } from '@nestjs/core';

export const Roles = Reflector.createDecorator<Role[]>();

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Create a book' })
  @ApiBody({ type: CreateBookDto })
  @ApiCreatedResponse({ type: BookEntity })
  @ApiBearerAuth()
  create(@Body() data: CreateBookDto) {
    return this.booksService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get books' })
  @ApiOkResponse({ type: BookEntity, isArray: true })
  @ApiQuery({ type: String, name: 'page', required: false })
  @ApiQuery({ type: String, name: 'size', required: false })
  @ApiQuery({ type: String, name: 'priceFrom', required: false })
  @ApiQuery({ type: String, name: 'priceTo', required: false })
  @ApiQuery({ type: String, name: 'titleLike', required: false })
  @ApiQuery({ name: 'tagsIn', isArray: true, enum: Tag, required: false })
  @ApiQuery({
    name: 'categoryNamesIn',
    isArray: true,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'authorNamesIn',
    isArray: true,
    type: String,
    required: false,
  })
  findAll(
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('tagIn') tagIn: string,
    @Query('categoryIdIn') categoryIdIn: string,
    @Query('authorIdIn') authorIdIn: string,
    @Query('titleLike') titleLike: string,
    @Query('priceFrom') priceFrom: string,
    @Query('priceTo') priceTo: string,
  ) {
    return this.booksService.findMany({
      page,
      size,
      categoryIdIn,
      tagIn,
      authorIdIn,
      titleLike,
      priceFrom,
      priceTo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific book' })
  @ApiOkResponse({ type: BookEntity })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiCreatedResponse({ type: BookEntity })
  update(@Param('id') id: string, @Body() data: UpdateBookBodyDto) {
    return this.booksService.update(id, data);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a book' })
  @ApiOkResponse({ type: BookEntity })
  @ApiBearerAuth()
  @ApiQuery({ name: 'ids', required: true })
  remove(@Query('ids') ids: string) {
    return this.booksService.remove(ids);
  }
}
