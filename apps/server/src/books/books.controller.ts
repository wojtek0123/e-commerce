import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';
import { Prisma } from '@prisma/client';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a book' })
  @ApiBody({ type: BookDto })
  @ApiCreatedResponse({ type: BookDto })
  create(@Body() data: Prisma.BookCreateInput) {
    return this.booksService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get books' })
  @ApiOkResponse({ type: BookDto, isArray: true })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific book' })
  @ApiOkResponse({ type: BookDto })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne({ id: +id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiCreatedResponse({ type: BookDto })
  update(@Param('id') id: string, @Body() data: Prisma.BookUpdateInput) {
    return this.booksService.update({ id: +id }, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiOkResponse({ type: BookDto })
  remove(@Param('id') id: string) {
    return this.booksService.remove({ id: +id });
  }
}
