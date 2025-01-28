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
import { BookReviewsService } from './book-reviews.service';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BookReview } from './entities/book-review.entity';

@ApiTags('book-reviews')
@Controller('book-reviews')
export class BookReviewsController {
  constructor(private readonly bookReviewsService: BookReviewsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Create book rating' })
  @ApiCreatedResponse({ type: BookReview })
  @ApiBearerAuth()
  create(
    @Body() body: CreateBookReviewDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.bookReviewsService.create(authHeader, body);
  }

  // @Get()
  // findAll() {
  //   return this.bookRatingsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bookRatingsService.findOne(+id);
  // }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Update book rating' })
  @ApiCreatedResponse({ type: BookReview })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() body: UpdateBookReviewDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.bookReviewsService.update(authHeader, id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Detele book rating' })
  @ApiOkResponse({ type: BookReview })
  @ApiBearerAuth()
  remove(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.bookReviewsService.remove(authHeader, id);
  }
}
