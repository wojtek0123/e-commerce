import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateBookReviewDto } from './create-book-review.dto';

export class UpdateBookReviewDto extends PartialType(
  OmitType(CreateBookReviewDto, ['bookId']),
) {}
