import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ShoppingSessionsService } from './shopping-sessions.service';
import { CreateShoppingSessionDto } from './dto/create-shopping-session.dto';
import { UpdateShoppingSessionDto } from './dto/update-shopping-session.dto';
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
  @ApiOperation({ summary: 'get user shopping session' })
  @ApiOkResponse({ type: ShoppingSessionEntity })
  findOne(@Headers('authorization') authHeader: string) {
    return this.shoppingSessionsService.findOne(authHeader);
  }
}
