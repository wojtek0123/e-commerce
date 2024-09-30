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

@Controller('credit-cards')
@ApiTags('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
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
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreditCard })
  findOne(@Headers('authorization') authHeader: string) {
    return this.creditCardsService.findOne(authHeader);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
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
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CreditCard })
  remove(
    @Headers('authorization') authHeader: string,
    @Param('id') id: CreditCard['id'],
  ) {
    return this.creditCardsService.remove(authHeader, id);
  }
}
