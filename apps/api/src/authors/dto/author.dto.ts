import { ApiProperty } from '@nestjs/swagger';
import { Author } from '@prisma/client';

export class AuthorDto implements Author {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;
}
