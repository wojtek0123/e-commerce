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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetBooksBodyDto } from './dto/get-books.dto';
import { BookEntity } from './entities/book.entity';
import { UpdateBookBodyDto } from './dto/update-body.dto';
import { CreateBookDto } from './dto/create-book.dto';

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

  @Post()
  @ApiOperation({ summary: 'Get books' })
  @ApiOkResponse({ type: BookEntity, isArray: true })
  findAll(@Body() data: GetBooksBodyDto) {
    return this.booksService.findMany(data);
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
