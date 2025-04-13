import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Book } from '../books/entities/book.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';
import { Inventory } from './entities/inventory.entity';
import { Pagination } from '../common/entities/pagination.entity';
import { SortKey } from '../books/models/sort-key.enum';
import { SortByMode } from '../common/entities/sort-by-mode.enum';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@ApiTags('inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get books' })
  @ApiOkResponse({ type: Pagination<Inventory>, isArray: true })
  @ApiQuery({ type: String, name: 'page', required: false })
  @ApiQuery({ type: String, name: 'size', required: false })
  @ApiQuery({ type: String, name: 'titleLike', required: false })
  @ApiQuery({
    enum: SortKey,
    default: SortKey.TITLE,
    name: 'sortBy',
    required: false,
  })
  @ApiQuery({
    enum: SortByMode,
    default: SortByMode.ASC,
    name: 'sortByMode',
    required: false,
  })
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  findAll(
    @Query('page') page: string,
    @Query('size') size: string,
    @Query('titleLike') titleLike: string,
    @Query('sortBy') sortBy: string,
    @Query('sortByMode') sortByMode: string,
  ) {
    return this.inventoriesService.findAll({
      sortByMode,
      sortBy,
      page,
      size,
      titleLike,
    });
  }

  @Get(':bookId')
  @ApiOkResponse({ type: Inventory })
  @ApiOperation({ summary: 'Get invertory for specific book' })
  findOne(@Param('bookId') bookId: Book['id']) {
    return this.inventoriesService.findOne(bookId);
  }

  @Post(':bookId')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiCreatedResponse({ type: Inventory })
  @ApiOperation({
    summary: 'Increase quantity for specific book',
  })
  updateQuantity(
    @Param('bookId') bookId: Book['id'],
    @Body() body: { quantity: number },
  ) {
    return this.inventoriesService.updateQuantity(bookId, body.quantity);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles([Role.ADMIN])
  @ApiOperation({ description: 'Create an inventory' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiCreatedResponse({ type: Book })
  @ApiBearerAuth()
  create(@Body() data: CreateInventoryDto) {
    return this.inventoriesService.create(data);
  }
}
