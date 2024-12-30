import {
  Controller,
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
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiOperation({ summary: 'Create a cart item' })
  @ApiCreatedResponse({ type: CartItemEntity })
  @ApiBearerAuth()
  create(
    @Headers('authorization') authHeader: string,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartItemsService.create(authHeader, createCartItemDto);
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

  @Patch(':shoppingSessionId/:bookId')
  @UseGuards(RolesGuard)
  @Roles([Role.USER])
  @ApiOperation({ summary: 'Update amount of the book' })
  @ApiOkResponse({ type: CartItemEntity })
  @ApiBearerAuth()
  update(
    @Headers('authorization') authHeader: string,
    @Param('bookId') bookId: string,
    @Param('shoppingSessionId') shoppingSessionId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemsService.update(
      authHeader,
      shoppingSessionId,
      bookId,
      updateCartItemDto,
    );
  }

  @Delete(':shoppingSessionId/:bookId')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiOperation({ summary: 'Delete a cart item' })
  @ApiOkResponse({ type: CartItemEntity })
  @ApiBearerAuth()
  remove(
    @Headers('authorization') authHeader: string,
    @Param('bookId') bookId: string,
    @Param('shoppingSessionId') shoppingSessionId: string,
  ) {
    return this.cartItemsService.remove(authHeader, shoppingSessionId, bookId);
  }
}
