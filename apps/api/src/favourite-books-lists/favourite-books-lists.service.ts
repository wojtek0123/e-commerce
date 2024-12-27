import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateFavouriteBooksListDto } from './dto/update-favourite-books-list.dto';
import { getUserIdFromAccessToken } from '../common/utils/get-user-id-from-access-token';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavouriteBooksListsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(authHeader: string) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const favouriteBooksList = await this.prisma.favouriteBooksList.findUnique({
      where: { userId },
      include: {
        books: {
          include: { authors: { include: { author: true } } },
        },
      },
    });

    return {
      ...favouriteBooksList,
      books: favouriteBooksList.books.map((book) => ({
        ...book,
        authors: book.authors.map((a) => a.author),
      })),
    };
  }

  async update(authHeader: string, { bookId }: UpdateFavouriteBooksListDto) {
    const userId = getUserIdFromAccessToken(authHeader);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const favouriteBooksList = await this.prisma.favouriteBooksList.findUnique({
      where: { userId },
      select: { books: true },
    });

    const isFavourite = favouriteBooksList.books.find(
      (book) => book.id === bookId,
    );

    const updatedFavouriteBooksList =
      await this.prisma.favouriteBooksList.update({
        where: { userId },
        data: {
          books: {
            ...(isFavourite
              ? { disconnect: { id: bookId } }
              : { connect: { id: bookId } }),
          },
        },
        include: {
          books: {
            include: { authors: { include: { author: true } } },
          },
        },
      });

    return {
      ...updatedFavouriteBooksList,
      books: updatedFavouriteBooksList.books.map((book) => ({
        ...book,
        authors: book.authors.map((a) => a.author),
      })),
    };
  }
}
