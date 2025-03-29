import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Book } from '../books/entities/book.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';
import { Inventory } from './entities/inventory.entity';

@ApiTags('inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

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
