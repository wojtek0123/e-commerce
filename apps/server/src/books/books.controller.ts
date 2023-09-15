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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiCreatedResponse({ type: BookDto })
  create(@Body() data: Prisma.BookCreateInput) {
    return this.booksService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: BookDto, isArray: true })
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: BookDto })
  findOne(@Param('id') id: Prisma.BookWhereUniqueInput) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: BookDto })
  update(
    @Param('id') id: Prisma.BookWhereUniqueInput,
    @Body() data: Prisma.BookUpdateInput
  ) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ type: BookDto })
  remove(@Param('id') id: Prisma.BookWhereUniqueInput) {
    return this.booksService.remove(id);
  }
}
