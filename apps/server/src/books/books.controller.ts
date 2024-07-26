import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetBooksBodyDto } from './dto/get-books.dto';
import { BookEntity } from './entities/book.entity';
import { UpdateBookBodyDto } from './dto/update-body.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Tag } from '@prisma/client';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a book' })
  @ApiBody({ type: CreateBookDto })
  @ApiCreatedResponse({ type: BookEntity })
  create(@Body() data: CreateBookDto) {
    return this.booksService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get books' })
  @ApiOkResponse({ type: BookEntity, isArray: true })
  @ApiQuery({ type: Number, name: 'page', required: false })
  @ApiQuery({ type: Number, name: 'size', required: false })
  @ApiQuery({ type: Number, name: 'priceFrom', required: false })
  @ApiQuery({ type: Number, name: 'priceTo', required: false })
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
    @Query('tagsIn') tagsIn: string,
    @Query('categoryNamesIn') categoryNamesIn: string,
    @Query('authorNamesIn') authorNamesIn: string,
    @Query('titleLike') titleLike: string,
    @Query('priceFrom') priceFrom: string,
    @Query('priceTo') priceTo: string,
  ) {
    return this.booksService.findMany({
      page,
      size,
      categoryNamesIn,
      tagsIn,
      authorNamesIn,
      titleLike,
      priceFrom,
      priceTo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific book' })
  @ApiOkResponse({ type: BookEntity })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiCreatedResponse({ type: BookEntity })
  update(@Param('id') id: string, @Body() data: UpdateBookBodyDto) {
    return this.booksService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiOkResponse({ type: BookEntity })
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
