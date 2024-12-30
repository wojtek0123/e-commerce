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
import { CreditCardsService } from './credit-cards.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CreditCard } from './entities/credit-card.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('credit-cards')
@ApiTags('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add credit card' })
  @ApiCreatedResponse({ type: CreditCard })
  create(
    @Headers('authorization') authHeader: string,
    @Body() data: CreateCreditCardDto,
  ) {
    return this.creditCardsService.create(authHeader, data);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreditCard })
  findOne(@Headers('authorization') authHeader: string) {
    return this.creditCardsService.findOne(authHeader);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CreditCard })
  update(
    @Headers('authorization') authHeader: string,
    @Param('id') id: CreditCard['id'],
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardsService.update(authHeader, id, updateCreditCardDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreditCard })
  remove(
    @Headers('authorization') authHeader: string,
    @Param('id') id: CreditCard['id'],
  ) {
    return this.creditCardsService.remove(authHeader, id);
  }
}
