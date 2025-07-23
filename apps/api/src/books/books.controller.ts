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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { UpdateBookBodyDto } from './dto/update-body.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { Role } from '@prisma/client';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Pagination } from '../common/entities/pagination.entity';
import { SortKey } from './models/sort-key.enum';
import { SortOrder } from './models/sort-order.enum';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ summary: 'Create a book' })
  @ApiBody({ type: CreateBookDto })
  @ApiCreatedResponse({ type: Book })
  @ApiBearerAuth()
  create(@Body() data: CreateBookDto) {
    return this.booksService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get books' })
  @ApiOkResponse({ type: Pagination<Book>, isArray: true })
  @ApiQuery({ type: String, default: '1', name: 'page', required: false })
  @ApiQuery({ type: String, default: '20', name: 'size', required: false })
  @ApiQuery({ type: String, name: 'priceFrom', required: false })
  @ApiQuery({ type: String, name: 'priceTo', required: false })
  @ApiQuery({ type: String, name: 'titleLike', required: false })
  @ApiQuery({
    enum: SortKey,
    default: SortKey.TITLE,
    name: 'sortBy',
    required: false,
  })
  @ApiQuery({
    enum: SortOrder,
    default: SortOrder.ASC,
    name: 'sortByMode',
    required: false,
  })
  @ApiQuery({ name: 'tagIn', type: String, required: false })
  @ApiQuery({ name: 'categoryIdIn', type: String, required: false })
  @ApiQuery({ name: 'authorIdIn', type: String, required: false })
  findAll(
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('tagIn') tagIn: string,
    @Query('categoryIdIn') categoryIdIn: string,
    @Query('authorIdIn') authorIdIn: string,
    @Query('publisherIdIn') publisherIdIn: string,
    @Query('titleLike') titleLike: string,
    @Query('priceFrom') priceFrom: string,
    @Query('priceTo') priceTo: string,
    @Query('sortBy') sortBy: string,
    @Query('sortByMode') sortByMode: string,
  ) {
    return this.booksService.findMany({
      page,
      size,
      categoryIdIn,
      tagIn,
      authorIdIn,
      publisherIdIn,
      titleLike,
      priceFrom,
      priceTo,
      sortBy,
      sortByMode,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific book' })
  @ApiOkResponse({ type: Book })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiCreatedResponse({ type: Book })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: UpdateBookBodyDto) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  @ApiOkResponse({ type: Book })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @ApiParam({ name: 'id', type: String, required: true })
  @Roles([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
