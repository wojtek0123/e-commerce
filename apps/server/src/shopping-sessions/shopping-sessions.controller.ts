import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import { CreateShoppingSessionDto } from './dto/create-shopping-session.dto';
import { UpdateShoppingSessionDto } from './dto/update-shopping-session.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('shopping sessions')
@Controller('shopping-sessions')
export class ShoppingSessionsController {
  constructor(
    private readonly shoppingSessionsService: ShoppingSessionsService
  ) {}

  @Post()
  create(@Body() createShoppingSessionDto: CreateShoppingSessionDto) {
    return this.shoppingSessionsService.create(createShoppingSessionDto);
  }

  @Get()
  findAll() {
    return this.shoppingSessionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingSessionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShoppingSessionDto: UpdateShoppingSessionDto
  ) {
    return this.shoppingSessionsService.update(+id, updateShoppingSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingSessionsService.remove(+id);
  }
}
