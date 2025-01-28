import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';

@Injectable()
export class BookReviewsService {
  constructor(private readonly prima: PrismaService) {}

  async create(authHeader: string, data: CreateBookReviewDto) {
    const userId = getUserIdFromAccessToken(authHeader);

    const isUserBuyBook = await this.prima.orderItem.findFirst({
      where: { AND: { orderDetails: { userId }, bookId: data.bookId } },
    });

    if (!isUserBuyBook) {
      throw new NotFoundException(
        "You cannot add review to book that you did't buy",
      );
    }

    return this.prima.bookReview.create({ data: { ...data, userId } });
  }

  async update(authHeader: string, id: string, data: UpdateBookReviewDto) {
    const userId = getUserIdFromAccessToken(authHeader);

    const updatedBookRating = this.prima.bookReview.update({
      where: { id, userId: userId },
      data,
    });

    if (!updatedBookRating) {
      throw new NotFoundException('Not found book rating');
    }

    return updatedBookRating;
  }

  async remove(authHeader: string, id: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    const deletedBookRating = await this.prima.bookReview.delete({
      where: { id, userId },
    });

    if (!deletedBookRating) {
      throw new NotFoundException(`Not found book rating`);
    }

    return deletedBookRating;
  }
}
