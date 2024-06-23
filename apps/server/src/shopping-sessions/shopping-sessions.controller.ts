import { Controller, Get, Delete, Headers, UseGuards } from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ShoppingSessionEntity } from './entities/shopping-session.entity';

@ApiTags('shopping-sessions')
@Controller('shopping-sessions')
export class ShoppingSessionsController {
  constructor(
    private readonly shoppingSessionsService: ShoppingSessionsService
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the shopping session' })
  @ApiOkResponse({ type: ShoppingSessionEntity })
  findOne(@Headers('authorization') authHeader: string) {
    return this.shoppingSessionsService.findOne(authHeader);
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove the shopping session' })
  @ApiOkResponse({ type: ShoppingSessionEntity })
  delete(@Headers('authorization') authHeader: string) {
    return this.shoppingSessionsService.remove(authHeader);
  }
}
