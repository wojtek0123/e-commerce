import {
  Controller,
  Get,
  Body,
  Patch,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { FavouriteBooksListsService } from './favourite-books-lists.service';
import { UpdateFavouriteBooksListDto } from './dto/update-favourite-books-list.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { FavouriteBooksList } from './entities/favourite-books-list.entity';
import { Roles, RolesGuard } from '../common/guards/role.guard';
import { Role } from '@prisma/client';

@ApiTags('favourite-books-lists')
@Controller('favourite-books-lists')
export class FavouriteBooksListsController {
  constructor(
    private readonly favouriteBooksListsService: FavouriteBooksListsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get favourite books list for specific user' })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: FavouriteBooksList })
  findOne(@Headers('authorization') authHeader: string) {
    return this.favouriteBooksListsService.findOne(authHeader);
  }

  @Patch()
  @ApiOperation({ summary: 'Update favourite books list for specific user' })
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([Role.USER])
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FavouriteBooksList })
  update(
    @Headers('authorization') authHeader: string,
    @Body() updateFavouriteBooksListDto: UpdateFavouriteBooksListDto,
  ) {
    return this.favouriteBooksListsService.update(
      authHeader,
      updateFavouriteBooksListDto,
    );
  }
}
