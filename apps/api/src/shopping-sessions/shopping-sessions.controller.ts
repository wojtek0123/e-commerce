import {
  Controller,
  Get,
  Delete,
  Headers,
  UseGuards,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ShoppingSessionEntity } from './entities/shopping-session.entity';
import { CreateCartItemDto } from '../cart-items/dto/create-cart-item.dto';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@ApiTags('shopping-sessions')
@Controller('shopping-sessions')
export class ShoppingSessionsController {
  constructor(
    private readonly shoppingSessionsService: ShoppingSessionsService,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the shopping session' })
  @ApiOkResponse({ type: ShoppingSessionEntity })
  findOne(@Headers('authorization') authHeader: string) {
    return this.shoppingSessionsService.findOne(authHeader);
  }

  @Delete()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER, Role.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove the shopping session' })
  @ApiOkResponse({ type: ShoppingSessionEntity })
  delete(@Headers('authorization') authHeader: string) {
    return this.shoppingSessionsService.remove(authHeader);
  }

  @Post(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create many cart items' })
  @ApiOkResponse({ type: ShoppingSessionEntity })
  @Roles([Role.USER])
  createManyCartItems(
    @Body() body: { cartItems: CreateCartItemDto[] },
    @Headers('authorization') authHeader: string,
    @Param('id') shoppingSessionId: string,
  ) {
    return this.shoppingSessionsService.createManyCartItems(
      authHeader,
      shoppingSessionId,
      body.cartItems,
    );
  }
}
