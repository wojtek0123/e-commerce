import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CartItemEntity } from './entities/cart-item.entity';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a cart item' })
  @ApiCreatedResponse({ type: CartItemEntity })
  create(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemsService.create(createCartItemDto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Find all cart items' })
  // @ApiOkResponse({ type: CartItemEntity, isArray: true })
  // findAll() {
  //   return this.cartItemsService.findAll();
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Find unique cart item' })
  // @ApiOkResponse({ type: CartItemEntity })
  // findOne(@Param('id') id: string) {
  //   return this.cartItemsService.findOne(+id);
  // }

  // @Get('user-cart-items')
  // @UseGuards(AccessTokenGuard)
  // @ApiOkResponse({ type: CartItemEntity, isArray: true })
  // @ApiBearerAuth()
  // findUserCartItems(@Headers('authorization') authHeader: string) {
  //   return this.cartItemsService.findUserCartItems(authHeader);
  // }

  // @Get('user-cart-items-total')
  // @UseGuards(AccessTokenGuard)
  // @ApiOkResponse({ type: Number })
  // @ApiBearerAuth()
  // getUserCartItemsTotal(@Headers('authorization') authHeader: string) {
  //   return this.cartItemsService.getUserCartItemsTotal(authHeader);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update amount of the book' })
  @ApiCreatedResponse({ type: CartItemEntity })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartItemsService.update(+id, updateCartItemDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Delete a cart item' })
  @ApiOkResponse({ type: CartItemEntity })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.cartItemsService.remove(+id);
  }
}
